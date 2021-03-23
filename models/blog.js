const mongoose = require('mongoose');
const moment = require('moment');
const commentSchema = require('../models/comment').schema;
const joi = require('joi');

const blogSchema = new mongoose.Schema({
    author : {
        type : String
    },
    title : {
        type : String,
        minLength : 3,
        maxLength : 15
    },
    text : {
        type : String,
        minLength : 5,
        maxLength : 120,
        required : true
    },
    date : {
        type : Date,
        default : moment()
    },
    comments:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'comments'
        // type : new mongoose.Schema({
        //     user : {
        //         type : Object
        //     },
        
        //     comment: {
        //         type: String
        //     }
        // })
    }]
});


const Blog = mongoose.model('Blogs', blogSchema);

async function getBlogs(){
    const allBlogs = await Blog.find().sort({date: -1});

    let blogs = [[]];
    var index = 0;
    var length = Math.ceil(allBlogs.length/3);
    for(var i = 0; i < length; i++){
        blogs[i]=[undefined,undefined,undefined];
        for(var j = 0; j < 3; j++){
            if(index === allBlogs.length) break;

            console.log(`i:${i}, j:${j}, index:${index}`);

            blogs[i][j] = allBlogs[index];
            index++;
        }
    }
    return blogs;
    //return blog
}

function validateBlog(blog) {
    const schema = joi.object({
        title : joi.string().required(),
        blog : joi.string().required()
    });

    return schema.validate(blog);
};

module.exports.validateBlog = validateBlog;
module.exports.blogSchema = blogSchema;
module.exports.Blog = Blog;
module.exports.getBlogs = getBlogs;