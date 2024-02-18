import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
//Route

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    throw error;
  }
};
app.listen(3000, () => {
  connect();
  console.log("Server is running on port 3000");
});
