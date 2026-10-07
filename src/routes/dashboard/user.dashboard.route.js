import express from "express";

import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../../modules/user/user.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, authorizeRoles("admin"), getUsers);

router.get("/:id", authMiddleware, authorizeRoles("admin"), getUser);

router.put("/:id", authMiddleware, authorizeRoles("admin"), updateUser);

router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteUser);

export default router;
