import express from "express";

import {
  getAllPayments,
  getAdminPaymentById,
} from "../../modules/payment/payment.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

// GET ALL PAYMENTS
router.get("/", authMiddleware, authorizeRoles("admin"), getAllPayments);

// GET PAYMENT BY ID
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  getAdminPaymentById,
);

export default router;
