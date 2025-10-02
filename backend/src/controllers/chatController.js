import asyncHandler from "express-async-handler";
import ChatRoom from "../models/ChatRoom.js";
import Message from "../models/Message.js";

// @desc    Get or create a chat room
// @route   GET /api/chat/rooms
// @access  Private
const getChatRooms = asyncHandler(async (req, res) => {
  // For this project, we'll create a default "General" room if it doesn't exist
  let generalRoom = await ChatRoom.findOne({ name: "General" });
  if (!generalRoom) {
    generalRoom = await ChatRoom.create({ name: "General" });
  }
  // In a real app, you'd find rooms the user is a member of
  const rooms = await ChatRoom.find({});
  res.json(rooms);
});

// @desc    Get messages for a room
// @route   GET /api/chat/rooms/:roomId/messages
// @access  Private
const getRoomMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ chatRoom: req.params.roomId })
    .populate("sender", "username profile")
    .sort({ createdAt: "asc" });
  res.json(messages);
});

export { getChatRooms, getRoomMessages };
