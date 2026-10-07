import express from "express";

import {
  createPayment,
  getCustomerPayments,
  getPaymentById,
} from "../../modules/payment/payment.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

// CREATE PAYMENT
router.post("/", authMiddleware, authorizeRoles("customer"), createPayment);

// GET MY PAYMENTS
router.get(
  "/",
  authMiddleware,
  authorizeRoles("customer"),
  getCustomerPayments,
);

// GET MY PAYMENT BY ID
router.get("/:id", authMiddleware, authorizeRoles("customer"), getPaymentById);

export default router;
