const mongoose = require("mongoose");


const answerSchema = new mongoose.Schema({
  testId: { type: String, require: [true, "A answer must have a test id."] },
  submittedAnswers: [
    {
      question: {
        type: String,
        required: true,
      },
      questionId: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
      correctAnswer: {
        type: String,
        required: true,
      }
    },
  ],
  subject: {
    type: String,
    required: [true, "A answer must have a subject."],
  },
  setNo: {
    type: Number,
    required: [true, "A answer must have a set no."],
  },
  score: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  testGiven: {
    type: Boolean,
    default: false,
  },
  userId: { type: String, require: [true, "A answer must have a user id."] },
  duration: {
    type: String,
    default: "00:00:00",
  },
});

answerSchema.set("timestamps", true);


const Answer = mongoose.model("answer", answerSchema);
module.exports = Answer;
