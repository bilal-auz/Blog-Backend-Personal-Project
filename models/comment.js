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

async function deleteComment(commentId){
    const deleteBlog = await Comment.findByIdAndRemove(commentId);
}
module.exports.schema = commentSchema;
module.exports.Comment = Comment;
module.exports.deleteComment = deleteComment;