import express from "express";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

import authDashboardRoute from "./auth.dashboard.route.js";
import categoryDashboardRoute from "./category.dashboard.route.js";
import productDashboardRoute from "./product.dashboard.route.js";
import productVariantDashboardRoute from "./productVariant.dashboard.route.js";
import customerDashboardRoute from "./customer.dashboard.route.js";
import inventoryDashboardRoute from "./inventory.dashboard.route.js";
import orderDashboardRoute from "./order.dashboard.route.js";
import paymentDashboardRoute from "./payment.dashboard.route.js";
import adminDashboardRoute from "./admin.dashboard.route.js";
import userDashboardRoute from "./user.dashboard.route.js";

const router = express.Router();

// Login route public ആയിരിക്കണം
router.use("/auth", authDashboardRoute);

// താഴെയുള്ള routes Admin മാത്രം access ചെയ്യണം
router.use(
  "/category",
  authMiddleware,
  authorizeRoles("admin"),
  categoryDashboardRoute,
);

router.use(
  "/product",
  authMiddleware,
  authorizeRoles("admin"),
  productDashboardRoute,
);

router.use(
  "/product-variant",
  authMiddleware,
  authorizeRoles("admin"),
  productVariantDashboardRoute,
);

router.use(
  "/customer",
  authMiddleware,
  authorizeRoles("admin"),
  customerDashboardRoute,
);

router.use(
  "/inventory",
  authMiddleware,
  authorizeRoles("admin"),
  inventoryDashboardRoute,
);

router.use(
  "/order",
  authMiddleware,
  authorizeRoles("admin"),
  orderDashboardRoute,
);

router.use(
  "/payment",
  authMiddleware,
  authorizeRoles("admin"),
  paymentDashboardRoute,
);

router.use(
  "/admin",
  authMiddleware,
  authorizeRoles("admin"),
  adminDashboardRoute,
);

router.use(
  "/user",
  authMiddleware,
  authorizeRoles("admin"),
  userDashboardRoute,
);

export default router;
