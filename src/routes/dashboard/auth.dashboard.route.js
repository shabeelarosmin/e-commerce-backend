import express from "express";
import { login, resetPassword } from "../../modules/auth/auth.controller.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log("Auth route reached:", req.method, req.originalUrl);
  next();
});

router.post("/login", login);
router.put("/reset-password", resetPassword);

export default router;
