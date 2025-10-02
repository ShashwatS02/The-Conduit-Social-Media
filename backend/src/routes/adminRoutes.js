import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getAllUsers, toggleUserBan } from "../controllers/adminController.js";

const router = express.Router();

// All routes in this file are protected and require admin role
router.use(protect, admin);

router.route("/users").get(getAllUsers);
router.route("/users/:id/ban").put(toggleUserBan);

export default router;
