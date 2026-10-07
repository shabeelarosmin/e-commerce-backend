import express from "express";

import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../modules/customer/customer.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("admin"), createCustomer);

router.get("/", authMiddleware, authorizeRoles("admin"), getCustomers);

router.get("/:id", authMiddleware, authorizeRoles("admin"), getCustomer);

router.put("/:id", authMiddleware, authorizeRoles("admin"), updateCustomer);

router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteCustomer);

export default router;
