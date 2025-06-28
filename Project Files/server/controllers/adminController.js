// server/controllers/adminController.js

const Appointment = require("../models/appointmentModel");

exports.getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorInfo")
      .populate("userInfo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "All appointments fetched",
      data: appointments,
    });
  } catch (err) {
    next(err); // pass to global error handler
  }
};
