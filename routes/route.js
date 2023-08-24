const express = require('express');
const router = express.Router();

//controller methods
const {getLoginPage,getSignupPage, registerUser,loginUser, getDashboard} = require('../controller/user');

router.route('/').get(getLoginPage).post(loginUser);
router.route('/signup').get(getSignupPage,).post(registerUser);
router.route('/user/dashboard').get(getDashboard)

module.exports = router;