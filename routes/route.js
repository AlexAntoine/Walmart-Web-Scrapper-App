const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

//controller methods
const {getLoginPage,getSignupPage, registerUser,loginUser, getDashboard} = require('../controller/user');

router.route('/').get(getLoginPage).post(loginUser);
router.route('/login').get(getLoginPage).post(loginUser);
router.route('/signup').get(getSignupPage,).post(registerUser);
router.route('/user/dashboard').get(auth,getDashboard)

module.exports = router;