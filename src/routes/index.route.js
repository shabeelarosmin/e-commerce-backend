import express from "express";

import websiteRoute from "./website/website.route.js";
import dashboardRoute from "./dashboard/dashboard.route.js";

const router = express.Router();

router.use("/website", websiteRoute);
router.use("/dashboard", dashboardRoute);

export default router;
