const jwt = require('jsonwebtoken');
const User = require('../model/user');

const auth = async(req, res, next)=>{

    try{

        const token = req.cookies.token;

        const decoded = jwt.verify(token,'abcd');
       
        const user = await User.findOne({id:decoded._id, 'tokens.token':token});
        
        req.token = token;
        req.user =user;

        next();
    }catch(e){

        console.log('Error: ', e);
        req.flash('error_msg', 'Please log in');
        res.redirect('/');
    }
}

module.exports = auth;