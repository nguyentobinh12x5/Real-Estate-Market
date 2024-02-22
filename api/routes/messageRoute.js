import express from "express";
import {
  addMessage,
  getAllMessages,
  getAllUsers,
  getContactList,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/addmsg", addMessage);
router.post("/getmsg", getAllMessages);
router.get("/allusers/:id", getAllUsers);
// router.get("/allusers/:userId/", getContactList);
export default router;
