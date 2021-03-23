const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const {User, getUserName} = require('../models/User');
const Blog = require('../models/blog').Blog;
const moment = require('moment');

router.get('/', async (req,res)=>{
    var passVal = false;
    var userName = "";

    if(req.session._id){
        passVal = true;
        userName = await getUserName(req.session._id);
    }
    
    res.render('./search/searchBar', {title: 'Blogs', pass : passVal, user : userName});
});


router.post('/', async(req, res)=>{
    var passVal = false;
    var userName = "";

    if(req.session._id){
        passVal = true;
        userName = await User.findById(req.session._id).select({userName: 1});
    }

    const blog = await Blog.find({title : req.body.searchTitle });
    
    if(blog.length > 0) return res.render('./search/showTitle', {title : 'Search', pass : passVal, blog : blog[0], moment : moment, user : userName});

    res.render('./search/showTitle', {title : 'Search', pass : passVal, blog : false, user : userName});
});


module.exports = router;
