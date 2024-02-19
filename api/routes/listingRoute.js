import express from "express";
import {
  createListing,
  deleteUserListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listingController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", createListing);
router.delete("/delete/:id", verifyToken, deleteUserListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);
export default router;
