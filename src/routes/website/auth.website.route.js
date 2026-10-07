import express from "express";

import {
  register,
  login,
  resetPassword,
} from "../../modules/auth/auth.controller.js";

const router = express.Router();

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// RESET PASSWORD
router.put("/reset-password", resetPassword);

export default router;
