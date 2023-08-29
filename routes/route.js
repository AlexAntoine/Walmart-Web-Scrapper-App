const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

//controller methods
const {getLoginPage,getSignupPage, registerUser,loginUser, getDashboard, logOut, addUser, getRegisterPage} = require('../controller/user');

router.route('/').get(getLoginPage).post(loginUser);
router.route('/login').get(getLoginPage).post(loginUser);
router.route('/signup').get(getSignupPage,).post(registerUser);
router.route('/register').get(auth,getRegisterPage).post(auth,addUser);
router.route('/dashboard').get(auth,getDashboard)
router.route('/logout').get(logOut)

module.exports = router;