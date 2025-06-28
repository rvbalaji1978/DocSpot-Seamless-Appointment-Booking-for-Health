// ───────────────────────────────────────────────────────────
// 3rd-party & model imports
// ───────────────────────────────────────────────────────────
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");
const Doctor = require("../models/doctorModel");

// ───────────────────────────────────────────────────────────
//  Public (un-protected) endpoints
// ───────────────────────────────────────────────────────────
exports.verifyUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "User verified successfully.",
    data: req.user,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  const filtered = users.map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    createdAt: u.createdAt,
    isAdmin: u.isAdmin,
    isDoctor: u.isDoctor,
  }));

  res.status(200).json({
    status: "success",
    message: "Users fetched successfully.",
    data: filtered,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    status: "success",
    message: "User fetched successfully.",
    data: user,
  });
});

/*───────────────────────────────────────────────────────────
 📞 NEW: save just a phone number (quick test route)
───────────────────────────────────────────────────────────*/
exports.registerPhone = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber)
    return res.status(400).json({ message: "Phone number is required" });

  const exists = await User.findOne({ phoneNumber });
  if (exists)
    return res.status(400).json({ message: "Phone number already registered" });

  const tempUser = await User.create({
    name: "Temp User",
    email: `temp-${Date.now()}@example.com`,
    phoneNumber,
    password: "TempPass123!",
  });

  res.status(201).json({
    status: "success",
    message: "Phone number saved",
    data: { id: tempUser._id, phoneNumber: tempUser.phoneNumber },
  });
});

/*───────────────────────────────────────────────────────────
 Protected routes (require authController.protect beforehand)
───────────────────────────────────────────────────────────*/

exports.bookAppointment = catchAsync(async (req, res, next) => {
   console.log("Incoming Appointment:", req.body); 
  req.body.status = "pending";
req.body.date = moment(req.body.date).toDate();               // full JS Date
req.body.time = moment(req.body.time, "HH:mm").toDate();      // parse time properly

  const newAppointment = await Appointment.create(req.body);

const doctorUser = await User.findById(req.body.doctorInfo.userId);

if (doctorUser) {
  if (!Array.isArray(doctorUser.unseenNotifications)) {
    doctorUser.unseenNotifications = [];
  }

  doctorUser.unseenNotifications.push({
    type: "new-appointment-request",
    message: `A new appointment request has been made by ${req.body.userInfo.name}`,
    data: { name: req.body.userInfo.name },
    onClickPath: "/doctor/appointments",
  });

  await doctorUser.save();
} else {
  console.error("Doctor user not found for notification");
}

  res.status(200).json({
    status: "success",
    message: "Appointment booked successfully.",
  });
});

exports.userAppointments = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find({ userId: req.params.id });

  res.status(200).json({
    status: "success",
    message: "Appointments fetched successfully.",
    data: appointments,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  await User.findByIdAndDelete(userId);
  await Doctor.findOneAndDelete({ userId });
  await Appointment.deleteMany({ doctorId: userId });

  res.status(204).json({ status: "success", data: null });
});

exports.notificationSeen = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.seenNotifications = [...(user.unseenNotifications || [])];
  user.unseenNotifications = [];

  const updated = await user.save();
  updated.password = undefined;

  res.status(200).json({
    status: true,
    message: "All notifications seen",
    data: updated,
  });
});

exports.deleteNotifications = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.seenNotifications = [];
  user.unseenNotifications = [];

  const updated = await user.save();
  updated.password = undefined;

  res.status(200).json({
    status: true,
    message: "All notifications deleted",
    data: updated,
  });
});

exports.doctorStatus = catchAsync(async (req, res, next) => {
  const { doctorId, status, userId } = req.body;

  const doctor = await Doctor.findByIdAndUpdate(doctorId, { status });
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.unseenNotifications = [
    ...(user.unseenNotifications || []),
    {
      type: "new-doctor-request-changed",
      message: `Your doctor request has been ${status}`,
      data: { name: user.name, doctorId: user._id },
      onClickPath: "/notifications",
    },
  ];
  user.isDoctor = status === "approved";

  await user.save();

  const doctors = await Doctor.find();

  res.status(200).json({
    status: true,
    message: "Doctor status changed successfully",
    data: doctors,
  });
});
