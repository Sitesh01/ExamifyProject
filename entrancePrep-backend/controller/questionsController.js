const Question = require("../models/questionsModel");
const catchAsync = require("../utils/catchAsync");
const sanitizeHtml = require('sanitize-html');
const he = require('he');
const schedule = require('node-schedule');

const crypto = require("crypto");


exports.getAllQuestions = catchAsync(async (req, res) => {
  const questions = await Question.find({ deleted: false }).sort({ _id: -1 });
  if (!questions) {
    return res.status(404).json({ status: "fail", msg: "Not found" });
  }
  res.status(200).json({
    status: "success",
    results: questions.length,
    data: {
      questions,
    },
  });
});


exports.createQuestion = catchAsync(async (req, res) => {
  console.log(req.body);
  const questionIdArr = [];

  if (Array.isArray(req.body)) { // If request body is an array
    for (const question of req.body) {
      const questionId = crypto.randomBytes(3).toString("hex");
      const sanitizedQuestion = sanitizeHtml(question.question);
      const sanitizedExplanation = sanitizeHtml(question.explanation);
      const decodedQuestion = he.decode(sanitizedQuestion);
      const decodedExplanation = he.decode(sanitizedExplanation);

      const newQuestion = await Question.create({
        question: decodedQuestion,
        options: question.options,
        setNo: question.setNo,
        correctAnswer: question.correctAnswer,
        explanation: decodedExplanation,
        imageLink: question.imageLink,
        userId: req.params.id,
        subject: question.subject,
        author: question.author,
        questionId: questionId,
        activatedDate: question.activatedDate // Assign the value of activeDate
      });
      questionIdArr.push(newQuestion.questionId);
    }
  } else { // If request body is not an array
    const questionId = crypto.randomBytes(3).toString("hex");
    const sanitizedQuestion = sanitizeHtml(req.body.question);
    const sanitizedExplanation = sanitizeHtml(req.body.explanation);
    const decodedQuestion = he.decode(sanitizedQuestion);
    const decodedExplanation = he.decode(sanitizedExplanation);
    const newQuestion = await Question.create({
      question: decodedQuestion,
      options: req.body.options,
      setNo: req.body.setNo,
      correctAnswer: req.body.correctAnswer,
      explanation: decodedExplanation,
      imageLink: req.body.imageLink,
      userId: req.params.id,
      subject: req.body.subject,
      author: req.body.author,
      questionId: questionId,
      activatedDate: req.body.activatedDate // Assign the value of activeDate
    });
    questionIdArr.push(newQuestion.questionId);
  }

  res.status(201).json({
    status: "success",
    data: {
      questions: questionIdArr
    }
  });
});

// Update the active status of questions
const updateActiveQuestions = async () => {
  const currentDate = new Date();
  console.log("Updating active questions at " + currentDate);

  await Question.updateMany(
    { activatedDate: { $lte: currentDate }, isActive: false },
    { isActive: true }
  );
};

// Schedule the function to run every day at midnight
const job = schedule.scheduleJob("0 0 * * *", updateActiveQuestions);


//get question by setNo
exports.getQuestion = catchAsync(async (req, res) => {
  const questions = await Question.find({ subject: req.params.subject, setNo: req.params.id, deleted: false, isActive: true });
  res.status(200).json({
    status: "success",
    results: questions.length,
    data: {
      questions,
    },
  });
});

//get question by _id
exports.getQuestionById = catchAsync(async (req, res) => {
  const question = await Question.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      question,
    },
  });
});

// get upcoming questions
exports.getUpcomingQuestions = catchAsync(async (req, res) => {
  const questions = await Question.find({ isActive: false, deleted: false }).sort({ _id: -1 });
  res.status(200).json({
    status: "success",
    results: questions.length,
    data: {
      questions,
    },
  });
});


exports.updateQuestion = catchAsync(async (req, res) => {

  const sanitizedQuestion = sanitizeHtml(req.body.question);
  const decodedQuestion = he.decode(sanitizedQuestion);
  const sanitizedExplanation = sanitizeHtml(req.body.explanation);
  const decodedExplanation = he.decode(sanitizedExplanation);
  req.body.question = decodedQuestion;
  req.body.explanation = decodedExplanation;

  const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  question.save();
  res.status(200).json({
    status: "success",
    data: {
      question
    },
  });
});

exports.deleteQuestion = catchAsync(async (req, res) => {
  const question = await Question.findByIdAndUpdate(req.params.id, {
    deleted: "true"
  },
    {
      new: true,
      runValidators: true,
    });
  res.status(200).json({
    status: "success",
    data: {
      question
    },
  });
});

//get question by subject
exports.getQuestionBySubject = catchAsync(async (req, res) => {
  const questions = await Question.find({ subject: req.params.subject, deleted: false, isActive: true });
  res.status(200).json({
    status: "success",
    results: questions.length,
    data: {
      questions,
    },
  });
});
