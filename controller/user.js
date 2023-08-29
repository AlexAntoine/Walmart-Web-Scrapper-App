const User = require('../model/user');

exports.getLoginPage = async(req, res)=>{
    console.log(req);
    res.render('login');
}

exports.getDashboard = async(req, res)=>{
    res.render('dashboard',{currentUser:req.user});
    // res.render('dashboard');
}

exports.getAllusers = (req, res)=>{
    
    res.render('allusers',{users:[], currentUser:req.user});
}

exports.loginUser = async(req,res)=>{
    try {
        const {email, password}=req.body;

        const user = await User.findByCredentials(email, password);

        const token = await user.generateAuthToken();

        res.cookie('token', token,{
            httpOnly:true
        });

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        
        res.redirect('/');
    }
}

exports.getSignupPage = async(req, res)=>{
    res.render('signup');
}

exports.getRegisterPage = (req, res)=>{

    res.render('register',{currentUser:req.user});
}

exports.registerUser = async(req, res)=>{
    
    const newUser = await User.create(req.body);

    const token = await newUser.generateAuthToken();

    await newUser.save();

    res.cookie('token',token,{
        httpOnly:true
    }); 
    
    res.redirect('/dashboard');


}

exports.addUser = async(req, res)=>{

    const newUser = new User({
        ...req.body
    });

    await newUser.save();

    req.flash('success_msg','Account Created Successfully!');

    res.redirect('/register');

}


exports.logOut = (req, res)=>{

    res.clearCookie('token');
    res.session = null;

    res.redirect('/');
}