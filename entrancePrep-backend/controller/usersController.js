const multer = require("multer");

const User = require("../models/usersModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const crypto = require("crypto");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadedUserPhoto = upload.single("file");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().sort({ _id: -1 });
  if (!users) {
    return res.status(404).json({ status: "fail", msg: "Not found" });
  }
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.body);
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword"
      ),
      400
    );
  }

  const filterBody = filterObj(req.body, "username", "email");
  if (req.file) filterBody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const currentUser = await User.find({uniqueID: req.params.id});
  if (!currentUser) {
    return res.status(404).json({ status: "fail", msg: "Not found" });
  }
  res.status(200).json({
    status: "success",
    data: {
      user: currentUser,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.createUser = catchAsync(async (req, res) => {
  const uniqueID = crypto.randomBytes(3).toString("hex");
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    role: req.body.role,
    isVerified: req.body.isVerified,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    uniqueID: uniqueID,
    createdVia: 'admin'
  });
  console.log(newUser);
  const createdUser = await User.create(newUser);
  res.status(201).json({
    status: "success",
    data: {
      user: createdUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  console.log(req.body, req.params.id);
  const user = await User.updateOne({ uniqueID: req.params.id }, req.body);
  if (!user) {
    return res.status(404).json({ status: "fail", msg: "Not found" });
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await User.deleteOne({ uniqueID: req.params.id });
  res.status(204).json({
    status: "success",
    data: null,
  });
});