import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  getAlgorithmicFeed,
  createPost,
  getPostsByUser,
  likePost,
  addComment,
  getComments,
} from "../controllers/postController.js";

const router = express.Router();

// This is the key change: The main feed now uses the new algorithmic function
router.route("/feed").get(getAlgorithmicFeed);

// Other routes for creating posts, getting user-specific posts, and interactions
router.route("/").post(protect, upload.single("image"), createPost);
router.route("/user/:userId").get(getPostsByUser);
router.route("/:id/like").put(protect, likePost);
router.route("/:id/comments").get(getComments).post(protect, addComment);

export default router;
