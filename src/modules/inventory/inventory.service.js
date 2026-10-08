import InventoryLog from "./inventoryLog.model.js";

// GET ALL INVENTORY LOGS
export const getInventoryLogsService = async () => {
  const logs = await InventoryLog.find()
    .populate("variantId")
    .sort({ createdAt: -1 });

  return logs;
};

// GET INVENTORY LOG BY ID
export const getInventoryLogByIdService = async (id) => {
  const log = await InventoryLog.findById(id).populate("variantId");

  if (!log) {
    throw new Error("Inventory log not found");
  }

  return log;
};
