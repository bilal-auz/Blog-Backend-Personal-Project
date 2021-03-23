const express = require('express');
const router = express.Router();
const {User, validateUser, getUserBlogs, getUserName} = require('../models/User');
const Blog = require('../models/blog').Blog;
const Comment = require('../models/comment').Comment;
const auth = require('../middlewares/auth');
const validateInputs = require('../middlewares/validateInputs');
const moment = require('moment');
const asyncHandler = require('../middlewares/asyncHandler');
//helpers
const checkIndex = require('../helpers/checkIndex'); 


router.get('/', auth,  asyncHandler( async (req, res, next)=>{
    const blogs = await getUserBlogs(req.session._id);

    const userName = await getUserName(req.session._id);

    const index = checkIndex(req.query.page, blogs.length);
    
    res.render('./blog/home', {title: 'Blogs', pass:true, user : userName, blogs:blogs, moment:moment, index : index});
}));

router.post('/', auth, asyncHandler(async(req,res)=>{
    //redirect the post of (edit form) to another router.post('/edit') 
    res.redirect(307,`/blogs/edit?page=${req.query.page}`);
}));

router.get('/add', auth, asyncHandler(async (req,res)=>{
    const blogs = await getUserBlogs(req.session._id);

    const userName = await getUserName(req.session._id);

    const index = checkIndex(req.query.page, blogs.length);

    res.render('./blog/add', {title: 'Blogs', pass:true, user : userName, blogs:blogs, moment:moment, index : index});
}));

router.post('/add', [auth, validateInputs],  asyncHandler(async (req, res, next)=>{
    const userName = await getUserName(req.session._id);

    const newBLog = Blog({
        author : userName,
        title : req.body.title,
        text : req.body.blog,
    });

    const result = await newBLog.save();
    
    const temp = await User.findOneAndUpdate({_id : req.session._id},{
        $push : {blogs : result._id }
    }, {new: true});


    res.redirect('/blogs');
}));

router.delete('/delete/:id',auth , asyncHandler(async (req,res, next)=>{
    const blog = await Blog.findByIdAndDelete(req.params.id);

    const user = await User.findById(req.session._id);
    
    const result = user.blogs.splice(user.blogs.indexOf(req.params.id), 1);
    await user.save();
}));

router.post('/edit', auth, asyncHandler(async (req,res)=>{
    const blog = await Blog.findByIdAndUpdate(req.body.blogId,{
        $set : {title : req.body.title, text : req.body.blog}
    });

    res.redirect('/blogs');
}));

//comments
router.get('/:id/info', auth, asyncHandler(async(req,res, next)=>{    
    const blog = await Blog.findById(req.params.id)
        .populate({path : 'comments'})
    ;

    if(!blog)  return next();

    var userName = await getUserName(req.session._id);

    res.render('./blog/comment',{title: 'Info', pass:true, blog : blog, moment:moment, user:userName});
}));

router.post('/:id/info', asyncHandler(async(req,res)=>{
    const user = await User.findById(req.session._id).select({userName : 1});

    
    const newComment = Comment({
        user : user,
        comment : req.body.comment
    });

    const cm = await newComment.save();

    const blog = await Blog.findByIdAndUpdate(req.params.id, {
        $push : {comments : cm._id}
    });

    await blog.save();
    
    res.redirect(`/blogs/${req.params.id}/info`);
}));

//edit Comments
router.post('/:id/edit', asyncHandler(async (req,res)=>{
    
    const comment = await Comment.findByIdAndUpdate(req.body.commentId,{
        $set : {comment : req.body.comment}
    });

    res.redirect(`/blogs/${req.params.id}/info`);
}));



router.delete('/:blogId/info/:commentId', asyncHandler(async (req,res)=>{
    const blog = await Blog.findById(req.params.blogId);

    const user = await User.findById(req.session._id);

    const comment = await Comment.findById(req.params.commentId);

    if(comment.user.userName !== user.userName) return console.log('auth err');

    const commentsArray = blog.comments;

    for (var comnt of commentsArray){
        console.log(`cmnt: ${comnt._id}, blog: ${comment._id}`);

        if(comnt._id.equals(comment._id)){
            const delComment = await Comment.findByIdAndDelete(comnt._id);

            const resSplice = blog.comments.splice(commentsArray.indexOf(comnt), 1);

            break;
        }
    }

    await blog.save();

}));




module.exports = router;