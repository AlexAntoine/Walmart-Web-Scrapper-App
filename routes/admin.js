const express = require('express');

const auth = require('../middleware/auth');
const {getNewProductPage, getDashboard, saveNewProduct, getSearchPage, getInstockPage, deleteProduct,priceChanged, deleteProdPriceChange, getOutOfStockPage, getBackInStockPage, getUpdated, getNotUpdated} = require('../controller/admin');

const router = express.Router();

router.route('/dashboard').get(auth,getDashboard);

router.route('/product/new').get(auth,getNewProductPage).post(auth, saveNewProduct);
router.route('/product/search').get(auth,getSearchPage);
router.route('/delete/product/:id').delete(auth, deleteProduct);
router.route('/products/instock').get(auth,getInstockPage);
router.route('/products/outofstock').get(auth,getOutOfStockPage);

router.route('/products/pricechanged').get(auth,priceChanged).delete();
router.route('/products/pricechanged/:id').delete(auth,deleteProdPriceChange);

router.route('/products/backinstock').get(auth,getBackInStockPage);

router.route('/products/updated').get(auth,getUpdated);
router.route('/products/notupdated').get(auth,getNotUpdated);
module.exports = router;