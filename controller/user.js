const User = require('../model/user');

exports.getLoginPage = async(req, res)=>{
    res.render('login');
}

exports.getDashboard = async(req, res)=>{

    res.render('dashboard');
}

exports.loginUser = async(req,res)=>{
    const {email, password}=req.body;

    const user = await User.findByCredentials(email, password);

    if(!user){
        res.redirect('/');
    }

    console.log(req)
    // res.redirect('/user/dashboard');
}

exports.getSignupPage = async(req, res)=>{
    res.render('signup');
}

exports.registerUser = async(req, res)=>{
    const {username, email, password} = req.body;

    const user = new User({
        username:username,
        email:email,
        password:password
    });

    const newUser = await user.save();
    console.log(newUser);

    res.redirect('/signup');
}