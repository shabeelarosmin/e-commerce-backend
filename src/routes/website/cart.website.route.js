import express from "express";

import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../modules/cart/cart.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("customer"), addToCart);
router.get("/", authMiddleware, authorizeRoles("customer"), getCart);

router.put(
  "/:cartId/item/:itemId",
  authMiddleware,
  authorizeRoles("customer"),
  updateCartItem,
);

router.delete(
  "/:cartId/item/:itemId",
  authMiddleware,
  authorizeRoles("customer"),
  removeCartItem,
);

router.delete(
  "/:cartId/clear",
  authMiddleware,
  authorizeRoles("customer"),
  clearCart,
);

export default router;
