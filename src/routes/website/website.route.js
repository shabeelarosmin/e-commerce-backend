import express from "express";

import authRoutes from "./auth.website.route.js";
import categoryRoutes from "./category.website.route.js";
import productRoutes from "./product.website.route.js";
import productVariantRoutes from "./productVariant.website.route.js";
import cartRoutes from "./cart.website.route.js";
import addressRoutes from "./address.website.route.js";
import orderRoutes from "./order.website.route.js";
import paymentRoutes from "./payment.website.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/product-variant", productVariantRoutes);
router.use("/cart", cartRoutes);
router.use("/address", addressRoutes);
router.use("/order", orderRoutes);
router.use("/payment", paymentRoutes);

export default router;
