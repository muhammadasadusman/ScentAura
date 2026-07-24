import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User Order
router.post("/", protect, createOrder);

// Admin Only
router.get("/", protect, admin, getOrders);

router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;