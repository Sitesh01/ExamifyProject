const Feedback = require("../models/feedbackModel");
const User = require("../models/usersModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllFeedbacks = catchAsync(async (req, res) => {
    const feedbacks = await Feedback.find({ deleted: false }).sort({ _id: -1 });
    if (!feedbacks) {
        return res.status(404).json({ status: "fail", msg: "Not found" });
    }
    res.status(200).json({
        status: "success",
        results: feedbacks.length,
        data: {
            feedbacks,
        },
    });
});


exports.submitFeedback = catchAsync(async (req, res) => {
    const newFeedback = await Feedback.create({
        feedback: req.body.feedback,
        userId: req.params.userId,
        testId: req.params.testId,
    });

    res.status(201).json({
        status: "success",
        data: {
            feedbacks: newFeedback,
        },
    });
});

exports.getFeedbackByUserId = catchAsync(async (req, res) => {
    const userIdArr = await Feedback.find({ deleted: false }).
        then(it => {
            return it.map(ele => {
                return { userId: ele.userId, feedback: ele.feedback, createdAt: ele.createdAt };
            });
        });


    console.log(userIdArr);

    let userIds = [];
    userIdArr.forEach(it => {
        userIds.push(it.userId);
    })

    const feedbackDetails = await User.find({ uniqueID: { $in: userIds } })
        .then(it => {
            return it.map(ele => {
                return { username: ele.username, email: ele.email, uniqueID: ele.uniqueID };
            });
        });

    console.log("data from users db: ", feedbackDetails);

    //now we have all the feedbacks and their corresponding user details, we need to match them and put them in an array of objects
    let feedbacks = [];
    userIdArr.forEach(it => {
        feedbackDetails.forEach(ele => {
            if (it.userId === ele.uniqueID) {
                feedbacks.push({ username: ele.username, email: ele.email, feedback: it.feedback, createdAt: it.createdAt });
            }
        })
    })


    console.log("data after merging: ", feedbacks);

    res.status(200).json({
        status: "success",
        results: feedbacks.length,
        data: {
            feedbacks,
        },
    });


});
