import Payment from "./payment.model.js";
import Order from "../order/order.model.js";
import Customer from "../customer/customer.model.js";

// CREATE PAYMENT
export const createPaymentService = async (data) => {
  const { customerId, orderId, amount, method } = data;

  // CHECK CUSTOMER
  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  // CHECK ORDER
  const order = await Order.findOne({
    _id: orderId,
    customerId,
  });

  if (!order) {
    throw new Error("Order not found or access denied");
  }

  // CHECK ALREADY PAID
  if (order.paymentStatus === "paid") {
    throw new Error("Order is already paid");
  }

  // CREATE PAYMENT
  const payment = await Payment.create({
    customerId,
    orderId,
    amount: amount || order.totalAmount,
    method: method || order.paymentMethod || "COD",
    paymentStatus: "pending",
  });

  return payment;
};

// GET MY PAYMENTS
export const getCustomerPaymentsService = async (customerId) => {
  const payments = await Payment.find({
    customerId,
  })
    .populate("orderId")
    .sort({ createdAt: -1 });

  if (!payments || payments.length === 0) {
    throw new Error("No payments found");
  }

  return payments;
};

// GET MY PAYMENT BY ID
export const getPaymentByIdService = async (customerId, paymentId) => {
  const payment = await Payment.findOne({
    _id: paymentId,
    customerId,
  }).populate("orderId");

  if (!payment) {
    throw new Error("Payment not found or access denied");
  }

  return payment;
};

// ADMIN - GET ALL PAYMENTS
export const getAllPaymentsService = async () => {
  const payments = await Payment.find()
    .populate("customerId")
    .populate("orderId")
    .sort({ createdAt: -1 });

  return payments;
};

// ADMIN - GET PAYMENT BY ID
export const getAdminPaymentByIdService = async (paymentId) => {
  const payment = await Payment.findById(paymentId)
    .populate("customerId")
    .populate("orderId");

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};
