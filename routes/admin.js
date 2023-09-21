const express = require('express');

const auth = require('../middleware/auth');
const {getNewProductPage, saveNewProduct, getSearchPage, getInstockPage, deleteProduct,priceChanged, deleteProdPriceChange} = require('../controller/admin');

const router = express.Router();

router.route('/product/new').get(auth,getNewProductPage).post(auth, saveNewProduct);
router.route('/product/search').get(auth,getSearchPage);
router.route('/delete/product/:id').delete(auth, deleteProduct);
router.route('/products/instock').get(auth,getInstockPage);

router.route('/products/pricechanged').get(auth,priceChanged).delete();
router.route('/products/pricechanged/:id').delete(auth,deleteProdPriceChange);
module.exports = router;