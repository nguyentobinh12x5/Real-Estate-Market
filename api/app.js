import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
dotenv.config();
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import listRouter from "./routes/listingRoute.js";
import messageRouter from "./routes/messageRoute.js";
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cookieParser());
//Route

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listRouter);
app.use("/api/message", messageRouter);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Socket.io
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  //sent message to the user in real time
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

//Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    throw error;
  }
};
server.listen(3000, () => {
  connect();
  console.log("Server is running on port 3000");
});
