const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./utils/dbConnect");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const morgan = require("morgan");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

// Configuration
dbConnect();
dotenv.config("./.env");
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

//middlewares
app.use(express.json({ limit: "50mb" }));
app.use(morgan("tiny"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// routers
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.get("/", async (req, res) => {
  return res.status(200).json({ message: "Hello from server" });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
