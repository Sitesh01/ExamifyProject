const mongoose = require("mongoose");


const feedbackSchema = new mongoose.Schema({
    testId: { type: String, require: [true, "A feedback must have a test id."] },
    userId: { type: String, require: [true, "A feedback must have a user id."] },
    feedback: {
        type: String,
        required: [true, "A feedback must have a feedback."],
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});

feedbackSchema.set("timestamps", true);


const Feedback = mongoose.model("feedback", feedbackSchema);
module.exports = Feedback;
