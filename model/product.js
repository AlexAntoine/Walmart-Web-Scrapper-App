const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
     
    title:String,
    newprice:String,
    price:String,
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