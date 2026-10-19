import Order from "./order.model.js";
import ProductVariant from "../productVariant/productVariant.model.js";
import Customer from "../customer/customer.model.js";
import InventoryLog from "../inventory/inventoryLog.model.js";

// CREATE ORDER
export const createOrderService = async (data) => {
  const { customerId, items, shippingAddress, paymentMethod } = data;

  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order items are required");
  }

  let totalAmount = 0;
  const orderItems = [];

  // CHECK STOCK AND CALCULATE TOTAL
  for (const item of items) {
    if (!item.variantId) {
      throw new Error("Variant ID is required");
    }

    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a positive integer");
    }

    const variant = await ProductVariant.findById(item.variantId);

    if (!variant) {
      throw new Error("Product variant not found");
    }

    if (!variant.active) {
      throw new Error("Product variant is inactive");
    }

    if (variant.stockQuantity < quantity) {
      throw new Error(`Insufficient stock for ${variant.sku}`);
    }

    const price = Number(variant.sellingPrice);
    const subtotal = price * quantity;

    totalAmount += subtotal;

    orderItems.push({
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      size: item.size,
      color: item.color,
      quantity,
      price,
      subtotal,
    });
  }

  // REDUCE STOCK AND CREATE INVENTORY LOG
  for (const item of orderItems) {
    const variant = await ProductVariant.findById(item.variantId);

    if (!variant) {
      throw new Error("Product variant not found");
    }

    const previousStock = variant.stockQuantity;
    const newStock = previousStock - item.quantity;

    variant.stockQuantity = newStock;
    await variant.save();

    await InventoryLog.create({
      variantId: item.variantId,
      type: "OUT",
      quantity: item.quantity,
      previousStock,
      newStock,
      reason: "Order created",
    });
  }

  // CREATE ORDER
  const order = await Order.create({
    customerId,
    items: orderItems,
    shippingAddress,
    totalAmount,
    paymentMethod: paymentMethod || "COD",
    paymentStatus: "pending",
    orderStatus: "placed",
  });

  return order;
};

// CUSTOMER - GET MY ORDERS
export const getCustomerOrdersService = async (customerId) => {
  const orders = await Order.find({ customerId })
    .populate({
      path: "items.productId",
      populate: {
        path: "categoryId",
        select: "name slug",
      },
    })
    .populate("items.variantId")
    .sort({ createdAt: -1 });

  return orders;
};

// CUSTOMER - GET MY ORDER BY ID
export const getOrderByIdService = async (customerId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    customerId,
  })
    .populate({
      path: "items.productId",
      populate: {
        path: "categoryId",
        select: "name slug",
      },
    })
    .populate("items.variantId");

  if (!order) {
    throw new Error("Order not found or access denied");
  }

  return order;
};

// ADMIN - GET ALL ORDERS
export const getAllOrdersService = async () => {
  const orders = await Order.find()
    .populate("customerId", "-password")
    .populate({
      path: "items.productId",
      populate: {
        path: "categoryId",
        select: "name slug",
      },
    })
    .populate("items.variantId")
    .sort({ createdAt: -1 });

  return orders;
};

// ADMIN - GET ORDER BY ID
export const getAdminOrderByIdService = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("customerId", "-password")
    .populate({
      path: "items.productId",
      populate: {
        path: "categoryId",
        select: "name slug",
      },
    })
    .populate("items.variantId");

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

// CUSTOMER - CANCEL ORDER
export const cancelOrderService = async (customerId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    customerId,
  });

  if (!order) {
    throw new Error("Order not found or access denied");
  }

  if (order.orderStatus === "cancelled") {
    throw new Error("Order is already cancelled");
  }

  if (order.orderStatus === "shipped" || order.orderStatus === "delivered") {
    throw new Error("Order cannot be cancelled");
  }

  // RESTORE STOCK
  for (const item of order.items) {
    const variant = await ProductVariant.findById(item.variantId);

    if (!variant) {
      throw new Error("Product variant not found");
    }

    const previousStock = variant.stockQuantity;
    const newStock = previousStock + item.quantity;

    variant.stockQuantity = newStock;
    await variant.save();

    await InventoryLog.create({
      variantId: item.variantId,
      type: "IN",
      quantity: item.quantity,
      previousStock,
      newStock,
      reason: "Order cancelled",
    });
  }

  order.orderStatus = "cancelled";
  await order.save();

  return order;
};

// ADMIN - UPDATE ORDER STATUS
export const updateOrderStatusService = async (orderId, status) => {
  const allowedStatuses = [
    "placed",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid order status");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.orderStatus === "cancelled") {
    throw new Error("Cancelled order cannot be updated");
  }

  if (order.orderStatus === "delivered") {
    throw new Error("Delivered order cannot be updated");
  }

  // Cancellation must use the cancellation flow that restores stock.
  if (status === "cancelled") {
    throw new Error("Use the cancellation flow to cancel the order");
  }

  const allowedNextStatus = {
    placed: ["confirmed"],
    confirmed: ["shipped"],
    shipped: ["delivered"],
  };

  if (!allowedNextStatus[order.orderStatus]?.includes(status)) {
    throw new Error(
      `Cannot change order status from ${order.orderStatus} to ${status}`,
    );
  }

  order.orderStatus = status;
  await order.save();

  return order;
};
