const commentController = require('../controller/commentController');
const authController = require("../controller/authController");

const express = require("express");
const router = express.Router();

router.route("/:blogId").get(commentController.getCommentByBlogId);
//protect all routes after this middleware
router.use(authController.protect);

router.route("/").get(commentController.getAllComments);
router.route("/:userId/:blogId").post(commentController.submitComment);


router.route("/markCommentAsVerified/:id").patch(commentController.markCommentAsVerified);

router.route("/reviewed/list").get(commentController.getReviewedComments);


// router
//   .route("/:id")
//   .patch(commentController.updateFeedback)
//   .delete(commentController.deleteFeedback);

module.exports = router;