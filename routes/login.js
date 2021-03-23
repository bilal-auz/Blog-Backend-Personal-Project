const express = require('express');
const router = express.Router();
const User = require('../models/User').User;

router.get('/', (req, res) =>{
    if(req.session._id) return res.redirect('/');
    return res.render('login', {title : 'login',pass: false});
});


router.post('/', async (req, res)=>{
    if(req.session._id) return res.redirect('/');
    
    if(!req.body.email || !req.body.password) return res.redirect('/login');
    const tempBody = req.body;

    const checkUser = await User.findOne({email: tempBody.email});

    if(!checkUser) return res.redirect('login');

    if(checkUser.password !== tempBody.password) return res.redirect('/login');

    req.session._id = checkUser._id;
    
    res.redirect('/');
});


module.exports = router;