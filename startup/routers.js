const config  = require('config');
const login = require('../routes/login');
const register = require('../routes/register');
const blogs = require('../routes/blog');
const search = require('../routes/search');
const session = require('express-session');
const express = require('express');
const {User, validateUser, getUserBlogs, getUserName} = require('../models/User');
const getBlogs = require('../models/blog').getBlogs;
const moment = require('moment');
const errorHandler = require('../middlewares/errorHandler');
//helpers
const checkIndex = require('../helpers/checkIndex'); 
require('express-async-errors');

module.exports = function (app){
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(express.static('./public'));
    app.use(session({
        secret : 'wrok hard',
        resave : false,
        saveUninitialized : false
    }));

    //main router
    app.get('/', async (req,res,next) =>{
        var passVal = false;
        var userName = "";

        if(req.session._id){
            passVal = true;
            userName = await getUserName(req.session._id);
        } 
        
        const blogs = await getBlogs();

        const index = checkIndex(req.query.page, blogs.length);

        res.render('./home', {title: 'Home', pass:passVal, user : userName,blogs:blogs, moment:moment, index : index});
    });
    app.get('/home', (req, res)=>{
        res.redirect('/');
    });

    app.use('/login', login);
    app.use('/register', register);
    app.use('/blogs', blogs);
    app.use('/search', search);
    app.use('/logout', (req,res,next) =>{
        if(req.session){
            req.session.destroy((err) =>{
                if(err){
                    return next(err);
                }else{
                    res.redirect('/');
                }
            });
        }
    });

    //router error handler NOT FOUND
    app.use(errorHandler);
};