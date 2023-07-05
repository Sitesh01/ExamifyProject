const blogsController = require("../controller/blogsController");
const authController = require("../controller/authController");

const express = require("express");
const router = express.Router();

router.route("/:id").get(blogsController.getBlog);
router.route("/").get(blogsController.getAllBlogs);
//protect all routes after this middleware
router.use(authController.protect);

// only admin can access routes after this middleware
router.use(authController.restrictTo("admin", "moderator"));

router.route("/").post(blogsController.createBlog);
router
  .route("/:id")
  .patch(blogsController.updateBlog)
  .delete(blogsController.deleteBlog);

module.exports = router;
