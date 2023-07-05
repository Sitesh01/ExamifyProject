const answersController = require("../controller/answersController");
const authController = require("../controller/authController");

const express = require("express");
const router = express.Router();

//protect all routes after this middleware
router.use(authController.protect);

router.route("/:id").post(answersController.submitAnswer);

router.route("/:id").get(answersController.getAnswer);

router
    .route("/getAnswerBySubject/:userId/:subject/:setNo")
    .get(answersController.getAnswerBySubject);

router.route("/getAnswerIfTestGiven/:userId/:subject/:setNo").get(answersController.getAnswerIfTestGiven);

router
    .route("/deleteAnswer/:userId/:subject/:setNo")
    .delete(answersController.deleteAnswer);

router.route("/getProgress/:userId").get(answersController.getProgress);

// only admin can access routes after this middleware
router.use(authController.restrictTo("admin", "moderator"));

router.route("/").get(answersController.getAllAnswers);
router.route("/examines/list").get(answersController.getRecentSubmission);
router.route("/examinesDetails/:testId").get(answersController.getAnswerByTestId);



module.exports = router;
