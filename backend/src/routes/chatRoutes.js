import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getChatRooms,
  getRoomMessages,
} from "../controllers/chatController.js";

const router = express.Router();

router.use(protect);

router.route("/rooms").get(getChatRooms);
router.route("/rooms/:roomId/messages").get(getRoomMessages);

export default router;
