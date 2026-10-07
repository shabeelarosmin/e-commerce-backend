import express from "express";

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

router.use("/auth", authDashboardRoute);
router.use("/category", categoryDashboardRoute);
router.use("/product", productDashboardRoute);
router.use("/product-variant", productVariantDashboardRoute);
router.use("/customer", customerDashboardRoute);
router.use("/inventory", inventoryDashboardRoute);
router.use("/order", orderDashboardRoute);
router.use("/payment", paymentDashboardRoute);
router.use("/admin", adminDashboardRoute);
router.use("/user", userDashboardRoute);

export default router;
