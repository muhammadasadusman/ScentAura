import express from "express";
import {
  createMessage,
  getMessages,
  markMessageRead,
  deleteMessage,
} from "../controllers/messageController.js";
import { protect, admin, optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public / Authenticated: send message to concierge
router.post("/", optionalProtect, createMessage);

// Admin only: view, mark read, delete
router.get("/", protect, admin, getMessages);
router.patch("/:id/read", protect, admin, markMessageRead);
router.delete("/:id", protect, admin, deleteMessage);

export default router;
