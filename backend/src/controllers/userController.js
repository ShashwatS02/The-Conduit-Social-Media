import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";
import Post from "../models/Post.js";

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserProfileById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all posts by a specific user
// @route   GET /api/users/:id/posts
// @access  Public
const getUserPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.params.id })
    .populate("author", "username profile")
    .sort({ createdAt: -1 });
  res.json(posts);
});

// @desc    Update user profile avatar
// @route   PUT /api/users/profile/avatar
// @access  Private
const updateUserAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (!req.file) {
      res.status(400);
      throw new Error("No image file provided.");
    }

    // Upload to Cloudinary, ensuring a square 400x400 avatar
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "social-avatars",
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    user.profile.avatar = result.secure_url;

    const updatedUser = await user.save();

    res.json({
      message: "Avatar updated successfully",
      avatarUrl: updatedUser.profile.avatar,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { getUserProfileById, getUserPosts, updateUserAvatar };
