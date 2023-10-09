const { Schema, model } = require("mongoose");

const userSchema = new Schema(
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
      type: String,
      default:
        "https://blogtimenow.com/wp-content/uploads/2014/06/hide-facebook-profile-picture-notification.jpg",
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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

module.exports = model("User", userSchema);
