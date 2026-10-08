import express from "express";

import {
  getInventoryLogs,
  getInventoryLogById,
} from "../../modules/inventory/inventory.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

// GET ALL INVENTORY LOGS
router.get("/", authMiddleware, authorizeRoles("admin"), getInventoryLogs);

// GET INVENTORY LOG BY ID
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  getInventoryLogById,
);

export default router;
