// ───────────────────────────────────────────────────────────
// 3rd Party Imports
// ───────────────────────────────────────────────────────────
const express = require("express");

// ───────────────────────────────────────────────────────────
// Custom Imports
// ───────────────────────────────────────────────────────────
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

// ───────────────────────────────────────────────────────────
// Auth Routes (Public)
// ───────────────────────────────────────────────────────────
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// ───────────────────────────────────────────────────────────
// Public Routes (No Auth Required)
// ───────────────────────────────────────────────────────────
router.get("/", userController.getAllUsers);
router.post("/register-phone", userController.registerPhone);

// ───────────────────────────────────────────────────────────
// Authenticated User Routes
// ───────────────────────────────────────────────────────────
router.get("/verify", authController.protect, userController.verifyUser); // ✅ This must come before /:id

// Protect all routes below
router.use(authController.protect);

// ───────────────────────────────────────────────────────────
// Core User Routes
// ───────────────────────────────────────────────────────────
router.route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

router.get("/verify-user/:id", userController.verifyUser);
router.post("/book-appointment", userController.bookAppointment);
router.get("/user-appointments/:id", userController.userAppointments);

// ───────────────────────────────────────────────────────────
// Notification Routes
// ───────────────────────────────────────────────────────────
router.post("/mark-all-notification-as-seen", userController.notificationSeen);
router.post("/delete-all-notifications", userController.deleteNotifications);

// ───────────────────────────────────────────────────────────
// Admin Routes
// ───────────────────────────────────────────────────────────
router.post("/change-doctor-status", userController.doctorStatus);

module.exports = router;
