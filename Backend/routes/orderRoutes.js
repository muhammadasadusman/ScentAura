import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/orderController.js";

import { protect, admin, optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Order creation (logged-in or guest checkout)
router.post("/", optionalProtect, createOrder);

// Admin Only
router.get("/", protect, admin, getOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.put("/:id/payment-status", protect, admin, updatePaymentStatus);

export default router;