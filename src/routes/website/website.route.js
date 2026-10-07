import express from "express";

import authWebsiteRoute from "./auth.website.route.js";
import categoryWebsiteRoute from "./category.website.route.js";
import productWebsiteRoute from "./product.website.route.js";
import productVariantWebsiteRoute from "./productVariant.website.route.js";
import cartWebsiteRoute from "./cart.website.route.js";
import addressWebsiteRoute from "./address.website.route.js";
import orderWebsiteRoute from "./order.website.route.js";
import paymentWebsiteRoute from "./payment.website.route.js";

const router = express.Router();

router.use("/auth", authWebsiteRoute);
router.use("/category", categoryWebsiteRoute);
router.use("/product", productWebsiteRoute);
router.use("/product-variant", productVariantWebsiteRoute);
router.use("/cart", cartWebsiteRoute);
router.use("/address", addressWebsiteRoute);
router.use("/order", orderWebsiteRoute);
router.use("/payment", paymentWebsiteRoute);

export default router;
