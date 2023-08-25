const User = require('../model/user');

exports.getLoginPage = async(req, res)=>{
    res.render('login');
}

exports.getDashboard = async(req, res)=>{
    res.render('dashboard',{currentUser:req.user});
    // res.render('dashboard');
}

exports.loginUser = async(req,res)=>{
    try {
        const {email, password}=req.body;

        const user = await User.findByCredentials(email, password);
    
        if(!user){
            res.redirect('/');
        }
    
        
        res.redirect('/user/dashboard');
    } catch (error) {
        console.log(error);
    }
}

exports.getSignupPage = async(req, res)=>{
    res.render('signup');
}

exports.registerUser = async(req, res)=>{
    
    const newUser = await User.create(req.body);

    const token = await newUser.generateAuthToken();

    await newUser.save();

    res.cookie('token',token,{
        httpOnly:true
    }); 
    
    res.redirect('/user/dashboard');


}