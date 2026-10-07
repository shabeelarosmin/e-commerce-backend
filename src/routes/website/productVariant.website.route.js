import express from "express";

import {
  getProductVariants,
  getProductVariant,
} from "../../modules/productVariant/productVariant.controller.js";

const router = express.Router();

router.get("/", getProductVariants);
router.get("/:id", getProductVariant);

export default router;
