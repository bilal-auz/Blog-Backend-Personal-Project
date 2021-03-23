
const BlogValid = require('../models/blog').validateBlog;


module.exports = function (req, res, next){
    try{
        const {error} = BlogValid(req.body);
        if(error) throw Error(error.message);

        next();
    }catch(ex){
        console.log("Error inputs");
        next(ex);
    }
};

