const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./utils/dbConnect");
// const morgan = require("morgan");
// const helmet = require("helmet");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
const commentRouter = require("./routers/commentRouter");

const app = express();

// Configuration
dotenv.config();
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//middlewares
app.use(express.json({ limit: "10mb" }));
// app.use(morgan("common"));
// app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// routers
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

app.get("/", async (req, res) => {
  return res.status(200).json({ message: "Hello from server" });
});

dbConnect();
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});

// Created By Ayush Kathariya.
