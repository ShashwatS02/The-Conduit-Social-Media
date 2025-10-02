import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  generateSocketToken,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/socket-token", protect, generateSocketToken);

export default router;
