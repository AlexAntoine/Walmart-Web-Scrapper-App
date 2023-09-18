require('dotenv').config();
const colors = require('colors')
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const express = require('express');
const {localDb} = require('./db/userDb');
const { urlencoded } = require('body-parser');

const app = express();

//Routes
const loginRoute = require('./routes/route.js');
const adminRoute  = require('./routes/admin');

localDb();

app.set('views', path.join(__dirname,'./views/users'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));
app.use(urlencoded({extended:true}));


app.use(cookieParser());
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys:['abcd']
}));

app.use(flash());
app.use(methodOverride('_method'));

app.use((req, res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash(('error_msg'));
    res.locals.error = req.flash(('error'));
    res.locals.currentUser = req.user;

    next();
});

app.use(loginRoute);
app.use(adminRoute);




module.exports =app;