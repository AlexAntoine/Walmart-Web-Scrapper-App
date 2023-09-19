const express = require('express');
const Product = require('../model/product');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

exports.getNewProductPage = async(req, res)=>{
    const url = req.query.search;

    if(url){
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();

        const result = await scrapeData(url, page);
        // console.log(result);
        let productData = {
            title:result.title,
            price:`$${result.price}`,
            stock: result.stock,
            productUrl:result.url
        }

        res.render('../admin/newProduct',{productData:productData,currentUser:req.user});
    
        browser.close()
    }else{

        const productData = {
            title:"",
            price:"",
            stock: "",
            productUrl:""
        }

        res.render('../admin/newProduct',{productData:productData,currentUser:req.user});
    }
   
}

exports.getInstockPage = async(req, res)=>{
    
    const products = await Product.find({newstock:'In Stock'})
    // console.log('line 43: ', product);
    res.render('../admin/instock',{currentUser:req.user, products})
}



exports.saveNewProduct = async(req, res)=>{
    const {url, title,price,stock,sku} = req.body;

    const newProduct = {
        ...req.body,
        price:price,
        newstock:stock,
        oldstock:stock,
        company:'Sam club',
        updatestatus:"Updated"
    }

    const result = await Product.findOne({sku:sku});

    if(result){
        
        req.flash('error_msg','Product already exist. Add a new product');

        return res.redirect('/product/new');
    }

    await Product.create(newProduct);

    req.flash('success_msg','Product successfully added to database');
    res.redirect('/product/new')


}
exports.getSearchPage = async(req, res)=>{
    const userSku = req.query.sku;
    
    if(userSku)
    {
        const foundProduct = await Product.findOne({sku:userSku});

        if(!foundProduct){
            req.flash('error_msg','Product does not exist in the database');
            return res.redirect('/product/search')
        }
       
        res.render('../admin/search',{productData:foundProduct, currentUser:req.user});
    }

    res.render('../admin/search',{productData:'', currentUser:req.user})
}

exports.deleteProduct = async(req, res)=>{
    const id = {_id:req.params.id};

    try{
         await Product.deleteOne(id);
    
        req.flash('success_msg','Product deleted successfully');
        res.redirect('/products/instock');
        
    }catch(error){
        
        console.log(error);
        req.flash('error_msg','Unable to delete product')
    }

}

const scrapeData = async(url, page)=>{
    let price = '';
    try {
        await page.goto(url,{waitUntil:'load', timeout:0});

        const html = await page.evaluate(()=> document.body.innerHTML);

        const $ = await cheerio.load(html);

        const title = $('#main > div > div > div.sc-pc-large-desktop-product-card > div > div.sc-pc-large-desktop-layout-columns > div.sc-pc-large-desktop-layout-content > div.sc-pc-title-full-desktop > h1').text();
        const dollar = $('#main > div > div > div.sc-pc-large-desktop-product-card > div > div.sc-pc-large-desktop-layout-columns > div.sc-pc-large-desktop-layout-content > div.sc-pc-channel-price > div > span.sc-price > span > span.Price-characteristic').text();
        const cents = $('#main > div > div > div.sc-pc-large-desktop-product-card > div > div.sc-pc-large-desktop-layout-columns > div.sc-pc-large-desktop-layout-content > div.sc-pc-channel-price > div > span.sc-price > span > span.Price-mantissa').text();
        const sku = $('#main > div > div > div.sc-pc-large-desktop-product-card > div > div.sc-pc-large-desktop-layout-columns > div.sc-pc-large-desktop-layout-content > div.sc-pc-title-full-desktop > div > div > div.sc-product-header-item-number').text();
        const stock = 'In Stock';
        price = `${dollar}.${cents}`

        console.log('line 54: ',title);
        return {
            title,
            price,
            url,
            sku,
            stock
        }
    } catch (error) {
        console.log(error);

    
    }
}