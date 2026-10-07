import {
  updateInventoryService,
  getInventoryLogsService,
  getVariantInventoryLogsService,
} from "./inventory.service.js";

// UPDATE INVENTORY
export const updateInventory = async (req, res) => {
  try {
    const { variantId, type, quantity } = req.body;

    // REQUIRED FIELD CHECK
    if (!variantId || !type || quantity === undefined) {
      return res.status(400).json({
        message: "variantId, type and quantity are required",
      });
    }

    // QUANTITY CHECK
    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    // TYPE CHECK
    const allowedTypes = ["IN", "OUT", "ADJUSTMENT", "RESERVED", "RELEASED"];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid inventory type",
      });
    }

    const inventory = await updateInventoryService(req.body);

    res.status(200).json({
      message: "Inventory updated successfully",
      data: inventory,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// GET ALL INVENTORY LOGS
export const getInventoryLogs = async (req, res) => {
  try {
    const logs = await getInventoryLogsService();

    res.status(200).json({
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET INVENTORY LOGS BY VARIANT
export const getVariantInventoryLogs = async (req, res) => {
  try {
    const logs = await getVariantInventoryLogsService(req.params.variantId);

    res.status(200).json({
      data: logs,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
