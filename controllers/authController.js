const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const oldUser = await User.findOne({ email, isVerified: true });
    if (oldUser) {
      return res.status(409).json({ message: "User is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = randomstring.generate({
      length: 6,
      charset: "numeric",
    });

    await User.create({
      name,
      email,
      password: hashedPassword,
      verifyOTP: otp,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_HOST,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_HOST,
      to: email,
      subject: "OTP Verification",
      text: `Your otp verification code ${otp}. Dont't share it with others`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return res.status(200).send({ message: `OTP sent to ${email}` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email, isVerified: true }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({ message: "Email is not registered" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const accessToken = generateAccessToken({
      _id: user._id,
    });

    return res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      verifyOTP: otp,
      verifyOTPExpiry: { $gt: Date.now() },
    });

    if (user) {
      user.isVerified = true;
      user.verifyOTP = null;
      user.verifyOTPExpiry = null;
      await user.save();
      return res.status(201).send({ message: "Signup Successful. Login !" });
    } else {
      return res.status(401).send({ message: "Invalid OTP" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "30d",
    });
    return token;
  } catch (error) {
    throw new Error(`Failed to generate access token: ${error}`);
  }
};

module.exports = {
  signupController,
  loginController,
  verifyOTPController,
};
