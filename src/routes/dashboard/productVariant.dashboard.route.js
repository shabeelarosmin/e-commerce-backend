import express from "express";

import {
  createProductVariant,
  getProductVariants,
  getProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "../../modules/productVariant/productVariant.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("admin"), createProductVariant);

router.get("/", authMiddleware, authorizeRoles("admin"), getProductVariants);

router.get("/:id", authMiddleware, authorizeRoles("admin"), getProductVariant);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateProductVariant,
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteProductVariant,
);

export default router;
