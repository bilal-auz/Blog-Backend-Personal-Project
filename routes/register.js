const express = require('express');
const router = express.Router();
const {User, validateUser} = require('../models/User');

router.get('/', (req, res) =>{
    if(req.session._id){
        return res.redirect('home');
    }

    res.render('register', {title : 'Register',pass: false});
});

router.post('/', async (req, res)=>{
    //turn into middleware
    if(req.session._id) return res.redirect('home');

    //into midlleware
    const {error} = validateUser(req.body);
    if(error) res.redirect('/register');
    
    var tempBody = req.body;

    //show the error message
    if(tempBody.password !== tempBody.confPassword){
        return res.status(401).render('register', {title : 'Register', pass: false, error: 'Not same password'});
    }

    const newUser = User({
        userName : tempBody.userName,
        email : tempBody.email,
        password : tempBody.password
    });

    await newUser.save();
    
    res.redirect('/login');
})

module.exports = router;