// backend/src/services/socket.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Message from "../models/Message.js";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user || user.isBanned) {
        return next(new Error("Authentication error: Invalid user"));
      }
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.id})`);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.user.username} joined room: ${roomId}`);
    });

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`${socket.user.username} left room: ${roomId}`);
    });

    socket.on("sendMessage", async (data) => {
      const { roomId, content } = data;
      try {
        const message = new Message({
          chatRoom: roomId,
          sender: socket.user._id,
          content,
        });
        await message.save();
        // Broadcast to everyone in the room including the sender
        io.to(roomId).emit("newMessage", {
          ...message.toObject(),
          sender: {
            _id: socket.user._id,
            username: socket.user.username,
          },
        });
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("typing", ({ roomId, isTyping }) => {
      socket
        .to(roomId)
        .emit("typing", { username: socket.user.username, isTyping });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.username} (${socket.id})`);
    });
  });
};

export default initializeSocket;
