const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

//controller methods
const {getLoginPage,getEditUserPage, getSignupPage, registerUser,loginUser, getDashboard, logOut, addUser, getRegisterPage, getAllusers, updateUser, deleteUser, getChangePasswordPage} = require('../controller/user');

router.route('/').get(getLoginPage).post(loginUser);
router.route('/login').get(getLoginPage).post(loginUser);
router.route('/signup').get(getSignupPage,).post(registerUser);
router.route('/register').get(auth,getRegisterPage).post(auth,addUser);
router.route('/users/all').get(auth,getAllusers);
router.route('/delete/user/:id').delete(auth, deleteUser);
router.route('/edit/:id').get(auth,getEditUserPage).put(updateUser)
router.route('/dashboard').get(auth,getDashboard);
router.route('/password/change').get(auth,getChangePasswordPage);
router.route('/logout').get(logOut)

module.exports = router;