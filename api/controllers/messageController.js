import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
export const addMessage = async (req, res, next) => {
  const { from, to, message } = req.body;
  if (req.user.id !== from.toString()) {
    return next(errorHandler(401, "You not authenticated to send message"));
  }
  try {
    const newMessage = new Message({
      message: {
        text: message,
      },
      users: [from, to],
      sender: from,
    });
    const savedMessage = await newMessage.save();
    if (savedMessage)
      return res.status(201).json({
        message: "Message sent successfully",
      });
    return next(errorHandler(400, "Message not sent"));
  } catch (error) {
    next(error);
  }
};
export const getAllMessages = async (req, res, next) => {
  const { from, to } = req.body;
  if (req.user.id !== from.toString()) {
    return next(
      errorHandler(
        401,
        "You not authenticated to read message in this conversation"
      )
    );
  }
  try {
    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.status(200).json(projectedMessages);
  } catch (error) {
    next(error);
  }
};
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatar",
      "_id",
    ]);
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
export const getContactList = async (req, res, next) => {
  const userId = req.params.userId;
  if (req.user.id !== userId.toString()) {
    return next(errorHandler(401, "You not authenticated"));
  }
  try {
    // Tìm tất cả các tin nhắn mà người dùng này đã gửi hoặc nhận
    const messages = await Message.find({
      $or: [{ sender: userId }, { users: userId }],
    })
      .populate("users")
      .populate("sender");

    // Tạo một set để lưu trữ danh sách liên hệ (để tránh trùng lặp)
    const contacts = new Set();

    // Duyệt qua tất cả các tin nhắn
    for (let message of messages) {
      // Thêm người gửi vào danh sách liên hệ
      if (message.sender._id.toString() !== userId) {
        contacts.add(message.sender);
      }
    }
    // Chuyển đổi set thành mảng và gửi kết quả
    res.status(200).json(Array.from(contacts));
  } catch (error) {
    next(error);
  }
};
