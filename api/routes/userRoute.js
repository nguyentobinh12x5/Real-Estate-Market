import express from "express";
import {
  updateUser,
  deleteUser,
  signOut,
  getUserListing,
} from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/signout", signOut);
router.get("/listings/:id", verifyToken, getUserListing);
export default router;
