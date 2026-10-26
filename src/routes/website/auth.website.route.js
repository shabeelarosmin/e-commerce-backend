import express from "express";

import {
  register,
  login,
  resetPassword,
  updateProfile,
} from "../../modules/auth/auth.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/reset-password", resetPassword);

// Update logged-in customer's profile
router.put("/profile", authMiddleware, updateProfile);

export default router;
