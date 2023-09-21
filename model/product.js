const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
     
    title:String,
    price:String,
    stock:String,
    newprice:String,
    oldprice:String,
    newstock:String,
    oldstock:String,
    sku:String,
    company:String,
    url:String,
    updatestatus:String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;