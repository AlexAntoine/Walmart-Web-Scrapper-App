const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },

    password:{
        type:String
    }
});



userSchema.pre('save',async function(next){

    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }

    next();
});

userSchema.statics.findByCredentials = async(email,password)=>{

    const user = await User.findOne({email:email});

    if(!user){
        console.log('user: ', user);
        throw new Error('unable to login');
    }

    const isMatched = await bcrypt.compare(password,user.password);

    if(!isMatched){
        throw new Error('unable to login');
    }

    return user;
}

const User = mongoose.model('user',userSchema);

module.exports = User;