import express from "express";

import {
  updateInventory,
  getInventoryLogs,
  getVariantInventoryLogs,
} from "../../modules/inventory/inventory.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/update",
  authMiddleware,
  authorizeRoles("admin"),
  updateInventory,
);

router.get("/logs", authMiddleware, authorizeRoles("admin"), getInventoryLogs);

router.get(
  "/logs/:variantId",
  authMiddleware,
  authorizeRoles("admin"),
  getVariantInventoryLogs,
);

export default router;
