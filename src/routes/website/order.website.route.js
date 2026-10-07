import express from "express";

import {
  createOrder,
  getCustomerOrders,
  getOrderById,
  cancelOrder,
} from "../../modules/order/order.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

// CREATE ORDER
router.post("/", authMiddleware, authorizeRoles("customer"), createOrder);

// GET MY ORDERS
router.get("/", authMiddleware, authorizeRoles("customer"), getCustomerOrders);

// GET MY ORDER BY ID
router.get("/:id", authMiddleware, authorizeRoles("customer"), getOrderById);

// CANCEL ORDER
router.put(
  "/:id/cancel",
  authMiddleware,
  authorizeRoles("customer"),
  cancelOrder,
);

export default router;
