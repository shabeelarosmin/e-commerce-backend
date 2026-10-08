import {
  getInventoryLogsService,
  getInventoryLogByIdService,
} from "./inventory.service.js";

// GET ALL INVENTORY LOGS
export const getInventoryLogs = async (req, res) => {
  try {
    const logs = await getInventoryLogsService();

    res.status(200).json({
      message: "Inventory logs fetched successfully",
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET INVENTORY LOG BY ID
export const getInventoryLogById = async (req, res) => {
  try {
    const log = await getInventoryLogByIdService(req.params.id);

    res.status(200).json({
      message: "Inventory log fetched successfully",
      data: log,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
