const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

/* ─────────── Get all approved doctors ─────────── */
exports.getAllApprovedDoctors = catchAsync(async (req, res, next) => {
  const doctors = await Doctor.find({ status: "approved" });
  res.status(200).json({ status: "success", data: doctors });
});

/* ─────────── Public: All doctors ─────────── */
exports.getAllDoctors = catchAsync(async (req, res, next) => {
  const doctors = await Doctor.find();
  res.status(200).json({ status: "success", data: doctors });
});

/* ─────────── Get doctor via userId or _id ─────────── */
exports.getDoctorByUserId = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findOne({ userId: req.params.userId });

  if (!doctor) {
    console.warn("Doctor not found for userId:", req.params.userId);
    return res.status(404).json({
      status: "fail",
      message: "Doctor not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: doctor,
  });
});

/* ─────────── Doctor Signup ─────────── */
exports.doctorSignup = catchAsync(async (req, res, next) => {
  const newDoctor = await Doctor.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Doctor added successfully. Please wait for admin approval.",
    data: newDoctor,
  });
});

/* ─────────── Doctor Appointments ─────────── */
exports.doctorAppointments = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find({ doctorId: req.params.doctorId })
    .populate("userId", "-password")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    data: appointments,
  });
});

/* ─────────── Check Booking Availability ─────────── */
exports.checkBookingAvailability = catchAsync(async (req, res, next) => {
  const { doctorId, date, time } = req.body;

  const from = new Date(`${date}T${time}`);
  const to = new Date(from.getTime() + 30 * 60 * 1000);

  const isBooked = await Appointment.findOne({
    doctorId,
    date,
    time: { $gte: from, $lt: to },
  });

  if (isBooked) {
    return res.status(200).json({
      status: false,
      message: "Slot not available. Please choose another time.",
    });
  }

  res.status(200).json({
    status: true,
    message: "Slot available! You can now book.",
  });
});

/* ─────────── Book Appointment ─────────── */
exports.bookAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.create(req.body);

  res.status(201).json({
    status: true,
    message: "Appointment booked successfully!",
    data: appointment,
  });
});

/* ─────────── Change Appointment Status ─────────── */
exports.changeAppointmentStatus = catchAsync(async (req, res, next) => {
  const { appointmentId, status } = req.body;

  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status },
    { new: true }
  );

  res.status(200).json({
    status: true,
    message: "Appointment status updated",
    data: appointment,
  });
});

/* ─────────── Doctor Profile Update ─────────── */
exports.updateDoctor = catchAsync(async (req, res, next) => {
  const updatedDoctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedDoctor,
  });
});
