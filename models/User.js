const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    bio: {
      type: String,
    },
    avatar: {
      publicId: String,
      url: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyOTP: {
      type: Number,
      default: null,
    },
    verifyOTPExpiry: {
      type: Date,
      default: Date.now() + 300000,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
