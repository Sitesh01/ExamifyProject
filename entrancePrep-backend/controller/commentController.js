const Comment = require("../models/commentsModel");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/usersModel");


exports.getAllComments = catchAsync(async (req, res) => {
    const comments = await Comment.find({
        deleted: false,
        verified: false,
    }).sort({ _id: -1 });

    if (!comments) {
        return res.status(404).json({ status: "fail", msg: "Not found" });
    }

    const userIds = comments.map((comment) => comment.userId);
    const users = await User.find({ uniqueID: { $in: userIds } });

    const commentsWithUsers = comments.map((comment) => {
        const user = users.find((user) => user.uniqueID === comment.userId);
        return {
            ...comment._doc,
            user: {
                username: user.username,
                email: user.email,
            },
        };
    });

    res.status(200).json({
        status: "success",
        results: commentsWithUsers.length,
        data: {
            commentsWithUsers,
        },
    });
});

exports.submitComment = catchAsync(async (req, res) => {
    const newComment = await Comment.create({
        comment: req.body.comment,
        userId: req.params.userId,
        blogId: req.params.blogId,
    });

    res.status(201).json({
        status: "success",
        data: {
            comments: newComment,
        },
    });
});

exports.getCommentByBlogId = catchAsync(async (req, res) => {
    const comments = await Comment.find({
        deleted: false,
        blogId: req.params.blogId,
        verified: true,
    }).sort({ _id: -1 });

    if (!comments) {
        return res.status(404).json({ status: "fail", msg: "Not found" });
    }

    const userIds = comments.map((comment) => comment.userId);
    const users = await User.find({ uniqueID: { $in: userIds } });

    const commentsWithUsers = comments.map((comment) => {
        const user = users.find((user) => user.uniqueID === comment.userId);
        return {
            ...comment._doc,
            user: {
                username: user.username,
            },
        };
    });

    res.status(200).json({
        status: "success",
        results: commentsWithUsers.length,
        data: {
            commentsWithUsers,
        },
    });
});

exports.markCommentAsVerified = catchAsync(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return res.status(404).json({ status: "fail", msg: "Not found" });
    }
    comment.verified = true;
    comment.verifiedBy = req.user.id;
    await comment.save();

    res.status(200).json({
        status: "success",
        data: {
            comment,
        },
    });
});

exports.getReviewedComments = catchAsync(async (req, res) => {
    console.log("getCommentByBlogId------------");
    const comments = await Comment.find({
        deleted: false,
        verified: true,
    }).sort({ _id: -1 });
    console.log("Comments: ", comments);

    if (!comments) {
        return res.status(404).json({ status: "fail", msg: "Not found" });
    }

    const userIds = comments.map((comment) => comment.userId);
    const users = await User.find({ uniqueID: { $in: userIds } });
    console.log("Users: ", users);

    const commentsWithUsers = comments.map((comment) => {
        const user = users.find((user) => user.uniqueID === comment.userId);
        return {
            ...comment._doc,
            user: {
                username: user.username,
            },
        };
    });

    console.log("Comments with users: ", commentsWithUsers);

    res.status(200).json({
        status: "success",
        results: commentsWithUsers.length,
        data: {
            commentsWithUsers,
        },
    });
});