import express from "express";
import {
  getPublicPaymentSettings,
  getAdminPaymentSettings,
  updatePaymentSettings,
} from "../controllers/paymentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: customer gets active payment methods for checkout
router.get("/active", getPublicPaymentSettings);

// Admin only: view and update payment methods
router.get("/admin", protect, admin, getAdminPaymentSettings);
router.put("/admin", protect, admin, updatePaymentSettings);

export default router;
