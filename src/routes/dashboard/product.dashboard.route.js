import express from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../../modules/product/product.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("admin"), createProduct);

router.get("/", authMiddleware, authorizeRoles("admin"), getProducts);

router.get("/:id", authMiddleware, authorizeRoles("admin"), getProduct);

router.put("/:id", authMiddleware, authorizeRoles("admin"), updateProduct);

router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteProduct);

export default router;
