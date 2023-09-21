const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

exports.samsClubApiCall = async(url, page)=>{

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