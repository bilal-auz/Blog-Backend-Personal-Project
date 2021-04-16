const mongoose = require('mongoose');
const {blogSchema, Blog} = require('./blog');
const joi = require('joi');

const userSchema = new mongoose.Schema({
    userName : {
        type: String,
        unique : true,
        minLenght : 4,
        maxLenght : 8,
        required : true
    }, 
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String, 
        minLenght : 5,
        maxLenght : 255,
        required : true
    },
    blogs : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Blogs'
    }]
});

const User = mongoose.model('Users', userSchema);

function validateUser(user){
    const schema = joi.object({
        userName : joi.string().min(4).max(8).required(),
        email : joi.string().required(),
        password : joi.string().min(5).max(255).required(),
        confPassword : joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}

async function getUserBlogs(id){
    const user = await User.findById(id)
        .populate({path : 'blogs', options : {sort: {'date' : -1}}})
    ;

    let blogs = [[]];
    var index = 0;
    var length = Math.ceil(user.blogs.length/3);
    for(var i = 0; i < length; i++){
        blogs[i]=[undefined,undefined,undefined];
        for(var j = 0; j < 3; j++){
            if(index === user.blogs.length) break;

            console.log(`i:${i}, j:${j}, index:${index}`);

            blogs[i][j] = user.blogs[index];
            index++;
        }
    }
    return blogs;
    //return blog
}

async function getUserName(id){
    const user = await User.findById(id).select({userName : 1});

    if(!user) return "";

    return user.userName;
}

async function isUserNameTaken(userName) {
    const checkUser = await User.find({userName});
    if(checkUser.length !== 0) return true;
    return false;
};

async function isEmailTaken(email) {
    const checkEmail = await User.find({email});
    if(checkEmail.length !== 0) return true;
    return false;
}
module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.getUserBlogs = getUserBlogs;
module.exports.getUserName = getUserName;
module.exports.isUserNameTaken = isUserNameTaken;
module.exports.isEmailTaken = isEmailTaken;