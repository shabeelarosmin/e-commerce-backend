import Order from "./order.model.js";
import ProductVariant from "../productVariant/productVariant.model.js";
import Customer from "../customer/customer.model.js";
import InventoryLog from "../inventory/inventoryLog.model.js";

// CREATE ORDER
export const createOrderService = async (data) => {
  const { customerId, items, shippingAddress, paymentMethod } = data;

  // Validate customer
  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  // Validate items
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order items are required");
  }

  if (!shippingAddress) {
    throw new Error("Shipping address is required");
  }

  let totalAmount = 0;
  const orderItems = [];

  // Validate all items before changing stock
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
      throw new Error(`Product variant ${variant.sku} is inactive`);
    }

    if (variant.stockQuantity < quantity) {
      throw new Error(`Insufficient stock for ${variant.sku}`);
    }

    const price = Number(variant.sellingPrice);

    if (!Number.isFinite(price) || price < 0) {
      throw new Error(`Invalid price for ${variant.sku}`);
    }

    const subtotal = price * quantity;

    totalAmount += subtotal;

    orderItems.push({
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      size: item.size ?? variant.size ?? "",
      color: item.color ?? variant.color ?? "",
      quantity,
      price,
      subtotal,
    });
  }

  // Reduce stock and create inventory logs
  for (const item of orderItems) {
    const variant = await ProductVariant.findById(item.variantId);

    // Check stock again before reducing
    if (!variant || variant.stockQuantity < item.quantity) {
      throw new Error("Insufficient stock or variant not found");
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

  // Create order
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
  return Order.find({ customerId })
    .populate("customerId", "name fullName email phone")
    .populate({
      path: "items.productId",
      populate: {
        path: "categoryId",
        select: "name slug",
      },
    })
    .populate("items.variantId")
    .sort({ createdAt: -1 });
};

// CUSTOMER - GET ORDER BY ID
export const getOrderByIdService = async (customerId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    customerId,
  })
    .populate("customerId", "name fullName email phone")
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
  return Order.find()
    .populate("customerId", "name fullName email phone")
    .populate({
      path: "items.productId",
      populate: {
        path: "categoryId",
        select: "name slug",
      },
    })
    .populate("items.variantId")
    .sort({ createdAt: -1 });
};

// ADMIN - GET ORDER BY ID
export const getAdminOrderByIdService = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("customerId", "name fullName email phone")
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

  if (["cancelled", "shipped", "delivered"].includes(order.orderStatus)) {
    throw new Error("This order cannot be cancelled");
  }

  // Restore stock
  for (const item of order.items) {
    const variant = await ProductVariant.findById(item.variantId);

    if (!variant) {
      throw new Error(
        `Product variant not found for order item ${item.name || ""}`,
      );
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
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase();

  const allowedStatuses = [
    "placed",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(normalizedStatus)) {
    throw new Error(
      `Invalid order status. Allowed statuses: ${allowedStatuses.join(", ")}`,
    );
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (["cancelled", "delivered"].includes(order.orderStatus)) {
    throw new Error(`Order with status ${order.orderStatus} cannot be updated`);
  }

  // Cancellation must use the cancellation service to restore stock
  if (normalizedStatus === "cancelled") {
    throw new Error("Use the cancellation flow to cancel the order");
  }

  // Only allow forward status transitions
  const allowedNextStatus = {
    placed: ["confirmed"],
    confirmed: ["shipped"],
    shipped: ["delivered"],
  };

  if (!allowedNextStatus[order.orderStatus]?.includes(normalizedStatus)) {
    throw new Error(
      `Cannot change order status from ${order.orderStatus} to ${normalizedStatus}`,
    );
  }

  order.orderStatus = normalizedStatus;

  await order.save();

  return order;
};
