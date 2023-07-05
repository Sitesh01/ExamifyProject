const feedbacksController = require("../controller/feedbackController");
const authController = require("../controller/authController");

const express = require("express");
const router = express.Router();

//protect all routes after this middleware
router.use(authController.protect);

router.route("/").get(feedbacksController.getAllFeedbacks);

router.route("/getFeedbacksByUserId").get(feedbacksController.getFeedbackByUserId);


// router.route("/:id").get(feedbacksController.getFeedback);

router.route("/:userId/:testId").post(feedbacksController.submitFeedback);
// router
//   .route("/:id")
//   .patch(feedbacksController.updateFeedback)
//   .delete(feedbacksController.deleteFeedback);

module.exports = router;
