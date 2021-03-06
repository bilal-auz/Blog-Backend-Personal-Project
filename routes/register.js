const express = require('express');
const router = express.Router();
const {User, validateUser, isUserNameTaken, isEmailTaken} = require('../models/User');
const emailValidator = require("email-validator");

router.get('/', (req, res) =>{
    if(req.session._id){
        return res.redirect('home');
    }

    res.render('register', {title : 'Register',pass: false, errors: "", values: {}});
});

router.post('/', async (req, res)=>{
    let errors = {
        userName: "",
        email: "",
        password: "",
        confPassword: ""
    };

    if(req.session._id) return res.redirect('home');

    try{
        req.body.email = req.body.email.trim();
        //validtion for empty (till now)
        const {error} = validateUser(req.body);
        if(error){
            errors.userName = error.message;
            throw Error(error.message);
        }

        //email Validation
        if(!emailValidator.validate(req.body.email)){
            errors.email = "Not Valid Email";
            throw Error("Not Valid Email");
        } 

        //passwords validation
        if(req.body.password !== req.body.confPassword){
            errors.password = "Doesn't Match";
            errors.confPassword = "Doesn't Match";
            throw Error("Passwords Don't Match");
        }
        if(await isUserNameTaken(req.body.userName)){
            errors.userName = "User Name Is Taken";
            throw Error("User Name Is Taken");
        }

        if(await isEmailTaken(req.body.email)){
            errors.email = "Email Name Is Taken";
            throw Error("Email Name Is Taken");
        }

    }catch(ex){
        return res.render('register', {title : 'Register', pass: false, errors: errors, values: req.body});
    }

    const newUser = User({
        userName : req.body.userName,
        email : req.body.email,
        password : req.body.password
    });

    await newUser.save();
    
    res.redirect('/login');
})

module.exports = router;