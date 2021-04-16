const express = require('express');
const router = express.Router();
const User = require('../models/User').User;
const emailValidator = require("email-validator");


router.get('/', (req, res) =>{
    if(req.session._id) return res.redirect('/');
    return res.render('login', {title : 'login',pass: false, errors: {}, values: {}});
});


router.post('/', async (req, res)=>{
    let errors ={
        email: "",
        password: ""
    };
    //if already logged in
    if(req.session._id) return res.redirect('/');

    //checks before fetching
    try{
        if(!req.body.email){
            errors.email = "*Empty Email";
            throw Error("*Empty Email");
        }
        if(!req.body.password){
            errors.password = "*Empty Password";
            throw Error("*Empty Email");
        }         
        if(!emailValidator.validate(req.body.email)){
            errors.email = "*Not Valid Email";
            throw Error("*Empty Email");
        } 
    }catch(ex){
        return res.render('login', {title : 'login', pass: false, errors, values: req.body});
    }
    
    //try fetching the user
    const checkUser = await User.findOne({email: req.body.email});

    //if no result
    if(!checkUser){
        errors.email = "*Wrong Email";
    }else{
        if(checkUser.password !== req.body.password){
            errors.password = "*Wrong Password";
        }
    }

    //if errors return to login form with errors feedBack
    if(errors.email || errors.password) return res.render('login', {title : 'login', pass: false, errors, values: req.body});

    //assing session id with user id
    req.session._id = checkUser._id;
    
    res.redirect('/');
});


module.exports = router;