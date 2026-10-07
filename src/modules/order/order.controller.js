import {
  createOrderService,
  getCustomerOrdersService,
  getOrderByIdService,
  getAllOrdersService,
  getAdminOrderByIdService,
  cancelOrderService,
} from "./order.service.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    const order = await createOrderService({
      ...req.body,
      customerId,
    });

    res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// CUSTOMER - GET MY ORDERS
export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    const orders = await getCustomerOrdersService(customerId);

    res.status(200).json({
      data: orders,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// CUSTOMER - GET MY ORDER BY ID
export const getOrderById = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    const order = await getOrderByIdService(customerId, req.params.id);

    res.status(200).json({
      data: order,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// CUSTOMER - CANCEL ORDER
export const cancelOrder = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    const order = await cancelOrderService(customerId, req.params.id);

    res.status(200).json({
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ADMIN - GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersService();

    res.status(200).json({
      data: orders,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// ADMIN - GET ORDER BY ID
export const getAdminOrderById = async (req, res) => {
  try {
    const order = await getAdminOrderByIdService(req.params.id);

    res.status(200).json({
      data: order,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
