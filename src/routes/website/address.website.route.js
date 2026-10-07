import express from "express";

import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "../../modules/address/address.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

// CREATE ADDRESS
router.post("/", authMiddleware, authorizeRoles("customer"), createAddress);

// GET MY ADDRESSES
router.get("/", authMiddleware, authorizeRoles("customer"), getAddresses);

// GET ADDRESS BY ID
router.get("/:id", authMiddleware, authorizeRoles("customer"), getAddressById);

// UPDATE ADDRESS
router.put("/:id", authMiddleware, authorizeRoles("customer"), updateAddress);

// DELETE ADDRESS
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("customer"),
  deleteAddress,
);

export default router;
