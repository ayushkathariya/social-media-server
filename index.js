const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./utils/dbConnect");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

// Configuration
dotenv.config("./.env");
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

//middlewares
app.use(express.json({ limit: "10mb" }));
// app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// routers
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.get("/", async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_HOST,
      pass: process.env.MAIL_PASS,
    },
  });

  function generateRandomOTP(length) {
    return randomstring.generate({
      length: length,
      charset: "numeric",
    });
  }

  // Function to send an OTP email to a user
  function sendOTPEmail(email, otp) {
    const mailOptions = {
      from: process.env.MAIL_HOST,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP code is: ${otp}. Don't share it to others.`,
    };

    return transporter.sendMail(mailOptions);
  }

  const userEmailAddress = "ayushkathariya7@gmail.com";
  const otp = generateRandomOTP(6);
  sendOTPEmail(userEmailAddress, otp)
    .then(() => {
      console.log(`OTP sent to ${userEmailAddress}`);
    })
    .catch((error) => {
      console.error(`Error sending OTP: ${error}`);
    });
  return res.status(200).json({ message: "Hello from server", otp });
});

const PORT = process.env.PORT || 4001;

dbConnect();
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
