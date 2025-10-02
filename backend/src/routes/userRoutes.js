import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  getUserProfileById,
  getUserPosts,
  updateUserAvatar,
} from "../controllers/userController.js";

const router = express.Router();

// Public routes for fetching profile data
router.route("/:id").get(getUserProfileById);
router.route("/:id/posts").get(getUserPosts);

// Protected route for a user to update their own avatar
router
  .route("/profile/avatar")
  .put(protect, upload.single("avatar"), updateUserAvatar);

export default router;
