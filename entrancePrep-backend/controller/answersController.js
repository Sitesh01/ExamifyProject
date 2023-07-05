const Answer = require("../models/answersModel");
const catchAsync = require("../utils/catchAsync");
const crypto = require("crypto");
const User = require("../models/usersModel");
const sanitizeHtml = require('sanitize-html');
const he = require('he');

exports.getAllAnswers = catchAsync(async (req, res) => {
    const answers = await Answer.find({ deleted: false }).sort({ _id: -1 });
    if (!answers) {
        return res.status(404).json({ status: "fail", msg: "Not found" });
    }
    res.status(200).json({
        status: "success",
        results: answers.length,
        data: {
            answers,
        },
    });
});

exports.getRecentSubmission = catchAsync(async (req, res) => {
    console.log("Inside getRecentSubmission: ");
    const answers = await Answer.find({ deleted: false }).sort({ _id: -1 });
    if (!answers) {
        return res.status(404).json({ status: "fail", msg: "Not found" });
    }

    console.log({ answers });

    const userIds = answers.map((ans) => ans.userId);
    const users = await User.find({ uniqueID: { $in: userIds } });
    console.log("Users: ", users);

    const answerWithUsers = answers.map((ans) => {
        const user = users.find((user) => user.uniqueID === ans.userId);
        return {
            ...ans._doc,
            user: {
                username: user.username,
                email: user.email,
            },
        };
    });

    console.log({ answerWithUsers });

    res.status(200).json({
        status: "success",
        results: answerWithUsers.length,
        data: {
            answerWithUsers,
        },
    });
});


exports.submitAnswer = catchAsync(async (req, res) => {
    const testId = crypto.randomBytes(3).toString("hex");
    const submittedAnswers = req.body.submittedAnswers;
    submittedAnswers.forEach((answer) => {
        const sanitizeQuestion = sanitizeHtml(answer.question);
        const decodedQuestion = he.decode(sanitizeQuestion);
        answer.question = decodedQuestion;
    });

    req.body.submittedAnswers = submittedAnswers;

    const percentage = (req.body.score / req.body.submittedAnswers.length) * 100;

    if (
        !Array.isArray(req.body.submittedAnswers) ||
        req.body.submittedAnswers.some((a) => !a.questionId || !a.answer)
    ) {
        return res.status(400).json({
            status: "fail",
            message:
                "submittedAnswers should be an array of objects with keys 'questionId' and 'answer'.",
        });
    }
    const newAnswer = await Answer.create({
        submittedAnswers: req.body.submittedAnswers,
        userId: req.params.id,
        subject: req.body.subject,
        setNo: req.body.setNo,
        score: req.body.score,
        duration: req.body.timeTakenToSubmit,
        correctAnswers: req.body.correctAnswers,
        percentage: percentage,
        testId: testId,
        testGiven: true,
    });
    res.status(201).json({
        status: "success",
        data: {
            answer: newAnswer,
        },
    });
});

exports.getAnswer = catchAsync(async (req, res) => {
    const answers = await Answer.find({
        deleted: false,
        userId: req.params.id,
    }).sort({ _id: -1 });
    res.status(200).json({
        status: "success",
        results: answers.length,
        data: {
            answers,
        },
    });
});

exports.getAnswerBySubject = catchAsync(async (req, res) => {
    const answers = await Answer.find({
        deleted: false,
        userId: req.params.userId,
        subject: req.params.subject,
        setNo: req.params.setNo,
    }).sort({ _id: -1 });
    console.log(answers);
    res.status(200).json({
        status: "success",
        results: answers.length,
        data: {
            answers,
        },
    });
});

exports.deleteAnswer = catchAsync(async (req, res) => {
    console.log(req.params);
    const answers = await Answer.find({
        deleted: false,
        userId: req.params.userId,
        subject: req.params.subject,
        setNo: req.params.setNo,
    });
    console.log(answers);
    if (!answers) {
        return res.status(404).json({ status: "fail", msg: "Not found" });
    }
    answers.forEach((answer) => {
        answer.deleted = true;
        answer.save();
    });
    res.status(204).json({
        status: "success",
        data: null,
    });
});


exports.getProgress = catchAsync(async (req, res) => {
    const answers = await Answer.find({
        userId: req.params.userId,
    }).sort({ _id: -1 });

    //from answers, get score, subject and percentage for each object and store in an array
    const data = answers.map((ans) => {
        return {
            score: ans.score,
            subject: ans.subject,
            percentage: ans.percentage,
            createdAt: ans.createdAt,
        };
    });

    res.status(200).json({
        status: "success",
        results: data.length,
        data: {
            data,
        },
    });
});

exports.getAnswerByTestId = catchAsync(async (req, res) => {
    const answers = await Answer.find({
        deleted: false,
        testId: req.params.testId,
    });
    console.log(answers);
    res.status(200).json({
        status: "success",
        results: answers.length,
        data: {
            answers,
        },
    });
});

exports.getAnswerIfTestGiven = catchAsync(async (req, res) => {
    console.log(req.params.setNo);
    //find all the answers of the user which are not deleted
    const answers = await Answer.find({
        deleted: false,
        userId: req.params.userId,
        subject: req.params.subject,
        setNo: req.params.setNo,
        testGiven: true,
    }).sort({ _id: -1 });

    console.log(answers);
    console.log(answers.length);

    //if the user has not given any test, return false
    if (answers.length === 0) {
        return res.status(200).json({
            status: "success",
            data: {
                givenTest: false,
            },
        });
    } else {
        //if the user has given the test, return true
        answers.forEach((answer) => {
            //get subject and setNo from the answer
            const subject = answer.subject;
            const setNo = answer.setNo;
            console.log(subject, setNo);
            console.log(typeof(setNo), typeof(req.params.setNo));
            // convert the setNo from params to number 
            const setNoFromParams = parseInt(req.params.setNo);
            
            console.log(typeof(setNoFromParams));
            //if the subject and setNo matches with the params, return true
            if (subject === req.params.subject && setNo === setNoFromParams) {
                console.log("-----------------");
                return res.status(200).json({
                    status: "success",
                    data: {
                        givenTest: true,
                    },
                });
            } else {
                console.log("++++++++++++++++++++");
                //if the subject and setNo does not match with the params, return false
                return res.status(200).json({
                    status: "success",
                    data: {
                        givenTest: false,
                    },
                });
            }
        });
    }

});