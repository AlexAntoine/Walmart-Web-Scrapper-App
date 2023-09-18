const express = require('express');

const auth = require('../middleware/auth');
const {getNewProductPage, saveNewProduct, getSearchPage, searchProduct} = require('../controller/admin');

const router = express.Router();

router.route('/product/new').get(auth,getNewProductPage).post(auth, saveNewProduct);
router.route('/product/search').get(auth,getSearchPage)

module.exports = router;