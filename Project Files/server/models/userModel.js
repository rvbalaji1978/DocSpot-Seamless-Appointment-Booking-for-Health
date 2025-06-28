const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    title: String,
    name: String,
    message: {
      type: String,
      required: true,
    },
    data: mongoose.Schema.Types.Mixed, // Can hold { doctorId } or { appointmentId }, etc.
    onClickPath: {
      type: String,
      required: true,
    },
  },
  { _id: false } // prevents creation of extra `_id` fields inside array
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phoneNumber: {
      type: String,
      unique: true,
      validate: {
        validator: validator.isMobilePhone,
        message: "Please provide a valid phone number",
      },
      required: [true, "Please provide your phone number"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    seenNotifications: {
      type: [notificationSchema],
      default: [],
    },
    unseenNotifications: {
      type: [notificationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

// ✅ Password verification method
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
