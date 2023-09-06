const User = require('../model/user');
 
exports.findUser = async(id)=>{

    const user = await User.findById(id);
   return user;
}
