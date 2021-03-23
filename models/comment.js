const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user : {
        type : Object
    },

    comment: {
        type: String
    }
});


const Comment = mongoose.model('comments', commentSchema);
module.exports.schema = commentSchema;
module.exports.Comment = Comment;