import express from "express";

import {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
} from "../../modules/order/order.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

// GET ALL ORDERS
router.get("/", authMiddleware, authorizeRoles("admin"), getAllOrders);

// UPDATE ORDER STATUS
router.put(
  "/:id/status",
  authMiddleware,
  authorizeRoles("admin"),
  updateOrderStatus,
);

// GET ORDER BY ID
router.get("/:id", authMiddleware, authorizeRoles("admin"), getAdminOrderById);

export default router;
