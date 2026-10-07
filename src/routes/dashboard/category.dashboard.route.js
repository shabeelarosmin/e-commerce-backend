import express from "express";

import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../../modules/category/category.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("admin"), createCategory);

router.get("/", authMiddleware, authorizeRoles("admin"), getCategories);

router.get("/:id", authMiddleware, authorizeRoles("admin"), getCategory);

router.put("/:id", authMiddleware, authorizeRoles("admin"), updateCategory);

router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteCategory);

export default router;
