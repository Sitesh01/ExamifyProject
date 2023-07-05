const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  blogId: { type: String, require: [true, "A blog must have a blog id."] },
  title: {
    type: String,
    require: [true, "A blog must have name."],
    minlength: [5, "A blog must have at least 5 characters."],
    maxlength: [100, "A blog must have less than 100 characters."],
    trim: true
  },
  category: {
    type: String,
    require: [true, "A blog must have category."],
    enum: ["Work", "Personal", "Others"],
    trim: true
  },
  content: {
    type: String,
    require: [true, "A blog must have content."],
    minlength: [10, "A blog must have at least 10 characters."],
    maxlength: [5000, "A blog must have less than 5000 characters."],
    trim: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  imageLink: {
    type: String,
    default: "https://source.unsplash.com/random/?city,night",
  },
  tags: {
    type: Array,
    default: [],
  },
  author: {
    type: String,
    require: [true, "A blog must have author."],
  },
  userId: { type: String, require: [true, "A blog must have a user id."] }
});

blogSchema.set("timestamps", true);

//to capitalize the first letter of the title and lowercase the content while adding new blog
blogSchema.pre("save", function (next) {
  const words = this.title.split(" ");
  const desc = this.content.split(" ");
  this.title = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  this.content = desc
    .map((w) => w.charAt(0).toLowerCase() + w.slice(1).toLowerCase())
    .join(" ");

  next();
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
