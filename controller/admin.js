const Product = require('../model/product');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const {samsClubApiCall} = require('../utils/apiCalls');

exports.getNewProductPage = async(req, res)=>{
    const url = req.query.search;

    if(url){
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();

        const result = await samsClubApiCall(url, page);

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

exports.priceChanged = async(req, res)=>{
    const products = await Product.find()
    
    res.render('../admin/pricechanged',{products:products,currentUser:req.user})
}

exports.getInstockPage = async(req, res)=>{
    
    const products = await Product.find({newstock:'In Stock'})
    
    res.render('../admin/instock',{currentUser:req.user, products})
}

exports.saveNewProduct = async(req, res)=>{
    const {url, title,price,stock,sku} = req.body;

    const newProduct = {
        ...req.body,
        price:price,
        stock,
        oldprice:price,
        newprice:price,
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

// Delete Prod Price Change
exports.deleteProdPriceChange = async(req, res)=>{

    const id = {_id:req.params.id};

    const result = await Product.deleteOne(id);

    res.redirect('/products/pricechanged')
}
