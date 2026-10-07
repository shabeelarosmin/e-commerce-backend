import InventoryLog from "./inventoryLog.model.js";
import ProductVariant from "../productVariant/productVariant.model.js";

// UPDATE INVENTORY
export const updateInventoryService = async (data) => {
  const { variantId, type, quantity, reason } = data;

  // CHECK VARIANT
  const variant = await ProductVariant.findById(variantId);

  if (!variant) {
    throw new Error("Product variant not found");
  }

  const previousStock = variant.stockQuantity;

  let newStock;

  // STOCK IN
  if (type === "IN") {
    newStock = previousStock + quantity;
  }

  // STOCK OUT
  else if (type === "OUT") {
    if (previousStock < quantity) {
      throw new Error("Insufficient stock");
    }

    newStock = previousStock - quantity;
  }

  // STOCK ADJUSTMENT
  else if (type === "ADJUSTMENT") {
    newStock = quantity;
  }

  // RESERVED
  else if (type === "RESERVED") {
    if (previousStock < quantity) {
      throw new Error("Insufficient stock");
    }

    newStock = previousStock - quantity;

    variant.reservedQuantity = variant.reservedQuantity + quantity;
  }

  // RELEASED
  else if (type === "RELEASED") {
    if (variant.reservedQuantity < quantity) {
      throw new Error("Insufficient reserved quantity");
    }

    variant.reservedQuantity = variant.reservedQuantity - quantity;

    newStock = previousStock + quantity;
  }

  // INVALID TYPE
  else {
    throw new Error("Invalid inventory type");
  }

  // UPDATE STOCK
  variant.stockQuantity = newStock;

  await variant.save();

  // CREATE INVENTORY LOG
  const log = await InventoryLog.create({
    variantId,
    type,
    quantity,
    previousStock,
    newStock,
    reason,
  });

  return {
    variant,
    log,
  };
};

// GET ALL INVENTORY LOGS
export const getInventoryLogsService = async () => {
  return await InventoryLog.find()
    .populate("variantId")
    .sort({ createdAt: -1 });
};

// GET INVENTORY LOGS BY VARIANT
export const getVariantInventoryLogsService = async (variantId) => {
  const variant = await ProductVariant.findById(variantId);

  if (!variant) {
    throw new Error("Product variant not found");
  }

  return await InventoryLog.find({ variantId })
    .populate("variantId")
    .sort({ createdAt: -1 });
};
