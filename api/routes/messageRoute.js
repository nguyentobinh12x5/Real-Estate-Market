import express from "express";
import {
  addMessage,
  getAllMessages,
  getContactList,
} from "../controllers/messageController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/addmsg", verifyToken, addMessage);
router.post("/getmsg", verifyToken, getAllMessages);
// router.get("/allusers/:id", getAllUsers);
router.get("/allusers/:userId/", verifyToken, getContactList);
export default router;
