const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    userId: { type: String, require: [true, "A comment must have a user id."] },
    blogId: { type: String, require: [true, "A comment must have a blog id."] },
    comment: {
        type: String,
        required: [true, "A comment must have a comment."],
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verifiedBy: {
        type: String,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});

commentSchema.set("timestamps", true);


const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
