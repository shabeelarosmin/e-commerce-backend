import {
  createPaymentService,
  getCustomerPaymentsService,
  getPaymentByIdService,
  getAllPaymentsService,
  getAdminPaymentByIdService,
} from "./payment.service.js";

// CREATE PAYMENT - WEBSITE
export const createPayment = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    const payment = await createPaymentService({
      ...req.body,
      customerId,
    });

    res.status(201).json({
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// GET MY PAYMENTS - WEBSITE
export const getCustomerPayments = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    const payments = await getCustomerPaymentsService(customerId);

    res.status(200).json({
      data: payments,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// GET MY PAYMENT BY ID - WEBSITE
export const getPaymentById = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    const payment = await getPaymentByIdService(customerId, req.params.id);

    res.status(200).json({
      data: payment,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// GET ALL PAYMENTS - ADMIN
export const getAllPayments = async (req, res) => {
  try {
    const payments = await getAllPaymentsService();

    res.status(200).json({
      data: payments,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// GET PAYMENT BY ID - ADMIN
export const getAdminPaymentById = async (req, res) => {
  try {
    const payment = await getAdminPaymentByIdService(req.params.id);

    res.status(200).json({
      data: payment,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
