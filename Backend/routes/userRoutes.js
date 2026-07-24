import express from "express";

import {
  registerUser,
  loginUser,
  getUserProfile,
   googleLogin,
    getUsers,
} from "../controllers/userController.js";

import { protect,admin } from "../middleware/authMiddleware.js";


const router = express.Router();


router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/google", googleLogin);

router.get("/profile", protect, getUserProfile);
// Admin Only
router.get("/", protect, admin, getUsers);

export default router;