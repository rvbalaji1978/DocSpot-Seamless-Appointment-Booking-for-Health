// controllers/authController.js
const jwt         = require("jsonwebtoken");
const catchAsync  = require("../utils/catchAsync");
const AppError    = require("../utils/appError");
const User        = require("../models/userModel");

/* ───────────────────────────── UTILITIES ────────────────────────────── */
const signToken = (user) =>
  jwt.sign(
    {
      id       : user._id,
      isDoctor : user.isDoctor,
      isAdmin  : user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user);

  // never expose password/hash in the response
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data  : { user },
  });
};

/* ─────────────────────────── SIGN-UP ─────────────────────────── */
exports.signup = catchAsync(async (req, res, next) => {
  // First user becomes admin
  const userCount = await User.countDocuments();
  const isAdmin   = userCount === 0;

  const newUser = await User.create({
    name       : req.body.name,
    email      : req.body.email,
    phoneNumber: req.body.phoneNumber,
    password   : req.body.password,
    isAdmin,
    isDoctor   : req.body.isDoctor || false,
  });

  createSendToken(newUser, 201, res);
});

/* ─────────────────────────── LOGIN ─────────────────────────── */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide email & password", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect email or password", 401));

  createSendToken(user, 200, res);
});

/* ─────────────────────────── PROTECT ─────────────────────────── */
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(new AppError("Not logged in", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Attach full user (fresh) to request
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError("User no longer exists", 401));

  req.user = currentUser; // => has isDoctor / isAdmin flags
  next();
});

/* ─────────────────────── ROLE-BASED RESTRICTION ─────────────────────── */
/**
 * Usage:  router.get("/admin-stuff", protect, restrictTo("admin"), handler)
 *         router.get("/doctor-only", protect, restrictTo("doctor"), handler)
 */
// middleware: restrict access by role
exports.restrictTo = (...roles) => {
  return (req, _res, next) => {
    // e.g. "doctor"  -> req.user.isDoctor
    const allowed = roles.some(
      (role) =>
        req.user[`is${role[0].toUpperCase()}${role.slice(1)}`] === true
    );

    if (!allowed) return next(new AppError("Forbidden", 403));
    next();
  };
};
