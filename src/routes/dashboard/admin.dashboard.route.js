import express from "express";

import {
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../modules/admin/admin.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("admin"), createAdmin);

router.get("/", authMiddleware, authorizeRoles("admin"), getAdmins);

router.get("/:id", authMiddleware, authorizeRoles("admin"), getAdmin);

router.put("/:id", authMiddleware, authorizeRoles("admin"), updateAdmin);

router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteAdmin);

export default router;
