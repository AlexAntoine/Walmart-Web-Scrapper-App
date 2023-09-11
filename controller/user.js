const User = require('../model/user');
const {findUser} = require('../utils/apiCalls');
const bcrypt = require('bcrypt');

exports.getLoginPage = async(req, res)=>{
 
    res.render('login');
}

exports.getChangePasswordPage = async(req, res)=>{

    res.render('changePassword',{currentUser:req.user});
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

exports.changePassword = async(req, res)=>{
    const {password:formPassword, confirmpassword} = req.body;

    try {

        if(formPassword !== confirmpassword){

            req.flash('error_msg','Passwords do not match. Please try again');
            return req.redirect('/password/change');
        }

        //Get user hashed password
        const {password} = await User.findById(req.user.id);

        //compare user hashed password with new password from the form
        const result = await bcrypt.compare(formPassword,password)

        if(result){
            req.flash('error_msg','Cannot use a previous password please enter a new password.');

            return res.redirect('/password/change');
        }
        else{

            //hash new password 
            const newPassword = await bcrypt.hash(formPassword,8);
          
            //replace old password with new password
            await User.updateOne({_id:req.user.id}, {$set:{
                password: newPassword
            }});

            req.flash('success_msg', 'Password updated successfully');
            res.redirect('/password/change');

        }
         
    } catch (error) {
        console.log('line 70: ',error);
        req.flash('error_msg','Unable to perform action. Please try again');

        res.redirect('/password/change');
    }
}
exports.updateUser = async(req, res)=>{

    try {
         await User.findByIdAndUpdate(req.params.id,req.body);
    
        req.flash('success_msg','User successfully updated!');
        res.redirect(`/edit/${req.params.id}`);

    } catch (error) {
        
        console.log('users line 98: ', error);

        req.flash('error_msg','unable able to update user. Please try again');
        res.redirect(`/edit/${req.params.id}`);
    }
 
}

exports.deleteUser = async(req, res)=>{
    const id = {_id:req.params.id}

    await User.deleteOne(id);
    
    req.flash('success_msg', 'User was deleted successfully!');

    res.redirect('/users/all')
}

exports.registerUser = async(req, res)=>{
    
    try {
        const newUser = await User.create(req.body);

        const token = await newUser.generateAuthToken();

        await newUser.save();
    
        res.cookie('token',token,{
            httpOnly:true
        }); 
        
        res.redirect('/dashboard');
        
    } catch (error) {
        console.log('line 85 ', error.code);
        
        if(error.code === 11000){
            req.flash('error_msg', 'This user already exist. Please enter and new username and email');
            res.redirect('/signup');
        }
    }
    
}

exports.addUser = async(req, res)=>{

    try {
        const newUser = new User({
            ...req.body
        });

        await newUser.save();

        req.flash('success_msg','Account Created Successfully!');

        res.redirect('/register');

    } catch (error) {
        console.log('Error: ', error);

        if(error.code === 11000){

            req.flash('error_msg', 'This user already exist. Please enter and new username and email');
           return res.redirect('/register');
        }

        req.flash('error_msg', 'Unable to preform intended action. Please try again.');
        res.redirect('/register');
    }
 

}


exports.logOut = (req, res)=>{

    res.clearCookie('token');
    res.session = null;

    res.redirect('/');
}