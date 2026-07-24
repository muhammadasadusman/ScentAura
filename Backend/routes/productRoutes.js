import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
} from "../controllers/productController.js";

const router = express.Router();

// Search Products
router.get("/search", searchProducts);

// Category Products
router.get("/category/:category", getProductsByCategory);

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// Create product (Admin Only)
router.post("/", protect, admin, createProduct);

// Update product (Admin Only)
router.put("/:id", protect, admin, updateProduct);

// Delete product (Admin Only)
router.delete("/:id", protect, admin, deleteProduct);

export default router;