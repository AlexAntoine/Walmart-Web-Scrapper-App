const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (error, req, res, next)=>{

    let err = {...error};

    err.message = error.message;

    console.log('line 7: ', err);

    if(error.code === 11000){
        console.log('hello world');
    }

}

module.exports = errorHandler;