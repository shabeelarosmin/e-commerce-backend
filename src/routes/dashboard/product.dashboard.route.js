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

import { productUpload } from "../../middleware/productUpload.js";

const router = express.Router();

// CREATE PRODUCT + IMAGE UPLOAD
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  productUpload.array("images", 5),
  createProduct,
);

// GET ALL PRODUCTS
router.get("/", authMiddleware, authorizeRoles("admin"), getProducts);

// GET SINGLE PRODUCT
router.get("/:id", authMiddleware, authorizeRoles("admin"), getProduct);

// UPDATE PRODUCT + IMAGE UPLOAD
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  productUpload.array("images", 5),
  updateProduct,
);

// DELETE PRODUCT
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteProduct);

export default router;
