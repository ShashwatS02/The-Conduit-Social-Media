import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  // Fetch all users but exclude their passwords
  const users = await User.find({}).select("-password");
  res.json(users);
});

// @desc    Ban or unban a user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const toggleUserBan = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Prevent an admin from banning themselves
    if (user._id.equals(req.user._id)) {
      res.status(400);
      throw new Error("Admin cannot ban themselves.");
    }

    user.isBanned = !user.isBanned;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      isBanned: updatedUser.isBanned,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { getAllUsers, toggleUserBan };
