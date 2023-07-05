const Blog = require("../models/blogsModel");
const catchAsync = require("../utils/catchAsync");
const sanitizeHtml = require('sanitize-html');
const he = require('he');
const crypto = require("crypto");

exports.getAllBlogs = catchAsync(async (req, res) => {
  const blogs = await Blog.find({ deleted: false }).sort({ _id: -1 });
  if (!blogs) {
    return res.status(404).json({ status: "fail", msg: "Not found" });
  }
  res.status(200).json({
    status: "success",
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

exports.createBlog = catchAsync(async (req, res) => {
  const blogId = crypto.randomBytes(3).toString("hex");

  const sanitizedContent = sanitizeHtml(req.body.content);
  const decodedContent = he.decode(sanitizedContent);

  const newBlog = await Blog.create(
    {
      title: req.body.title,
      category: req.body.category,
      content: decodedContent,
      author: req.body.author,
      userId: req.params.id,
      tags: req.body.tags,
      imageLink: req.body.imageLink,
      blogId: blogId
    }
  );
  res.status(201).json({
    status: "success",
    data: {
      blog: newBlog,
    },
  });
});

exports.getBlog = catchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res) => {
  const sanitizedContent = sanitizeHtml(req.body.content);
  const decodedContent = he.decode(sanitizedContent);
  req.body.content = decodedContent;
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

 
  res.status(200).json({
    status: "success",
    data: {
      blog
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, {
    deleted: "true"
  },
    {
      new: true,
      runValidators: true,
    });
  res.status(200).json({
    status: "success",
    data: {
      blog
    },
  });
});
