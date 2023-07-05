const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        require: [true, "A question must have name."],
        minlength: [10, "A question must have at least 10 characters."],
        maxlength: [1000, "A question must have less than 1000 characters."],
        trim: true
    },
    subject: {
        type: String,
        require: [true, "A question must have subject."],
        trim: true
    },
    setNo: {
        type: Number,
        require: [true, "A question must have category."],
        trim: true
    },
    options: {
        type: Array,
        require: [true, "A question must have options."],
        trim: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    correctAnswer: {
        type: String,
        require: [true, "A question must have author."]
    },
    explanation: {
        type: String,
    },
    imageLink: {
        type: String,
    },
    author: {
        type: String,
        require: [true, "A question must have author."],
    },
    questionId: {
        type: String,
        unique: true,
    },
    userId: { type: String, require: [true, "A question must have a user id."] },
    activatedDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: false }
});

questionSchema.set("timestamps", true);

const Question = mongoose.model("question", questionSchema);
module.exports = Question;
