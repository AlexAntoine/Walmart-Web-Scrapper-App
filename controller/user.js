const User = require('../model/user');
const {findUser, updateUser} = require('../utils/apiCalls');
exports.getLoginPage = async(req, res)=>{
 
    res.render('login');
}

exports.getDashboard = async(req, res)=>{
    res.render('dashboard',{currentUser:req.user});
}

exports.getAllusers = async(req, res)=>{
    const users = await User.find();

    res.render('allusers',{users:users, currentUser:req.user});
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

exports.getEditUserPage = async(req, res)=>{
    const user = await findUser(req.params.id);
    
    res.render('editUser',{currentUser:user, user:user});
}
exports.updateUser = async(req, res)=>{
    const user =  await User.findByIdAndUpdate(req.params.id,req.body);
    
    req.flash('success_msg','User successfully updated!');
    res.redirect(`/edit/${req.params.id}`);
}

exports.deleteUser = async(req, res)=>{
    const id = {_id:req.params.id}

    await User.deleteOne(id);
    
    req.flash('success_msg', 'User was deleted successfully!');

    res.redirect('/users/all')
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