const questionsController = require("../controller/questionsController");
const authController = require("../controller/authController");

const express = require("express");
const router = express.Router();

router.route("/upcomingQuestions").get(questionsController.getUpcomingQuestions);


//protect all routes after this middleware
router.use(authController.protect);

router.route("/").get(questionsController.getAllQuestions);

router.route("/questionsInSet/:subject/:id").get(questionsController.getQuestion);

router.route("/getQuestionBySubject/:subject").get(questionsController.getQuestionBySubject);



// only admin can access routes after this middleware
router.use(authController.restrictTo("admin", "moderator"));

router.route("/").post(questionsController.createQuestion);
router.route("/getQuestionById/:id").get(questionsController.getQuestionById);
router
  .route("/:id")
  .patch(questionsController.updateQuestion)
  .delete(questionsController.deleteQuestion);

module.exports = router;
