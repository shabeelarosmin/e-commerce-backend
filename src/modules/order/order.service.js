import Order from "./order.model.js";
import ProductVariant from "../productVariant/productVariant.model.js";
import Customer from "../customer/customer.model.js";
import InventoryLog from "../inventory/inventoryLog.model.js";

// Reusable population for order details
const populateOrderDetails = (query) => {
  return query
    .populate({
      path: "customerId",
      select: "name email phone address city state pincode",
    })
    .populate({
      path: "items.productId",
      populate: {
        path: "categoryId",
        select: "name slug",
      },
    })
    .populate("items.variantId");
};

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

  if (!shippingAddress) {
    throw new Error("Shipping address is required");
  }

  let totalAmount = 0;
  const orderItems = [];

  // Validate items before changing stock
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

  const order = await Order.create({
    customerId,
    items: orderItems,
    shippingAddress,
    totalAmount,
    paymentMethod: paymentMethod || "COD",
    paymentStatus: "pending",
    orderStatus: "placed",
  });

  // Return order with customer details populated
  return populateOrderDetails(Order.findById(order._id));
};

// CUSTOMER - GET MY ORDERS
export const getCustomerOrdersService = async (customerId) => {
  return populateOrderDetails(
    Order.find({ customerId }).sort({ createdAt: -1 }),
  );
};

// CUSTOMER - GET ORDER BY ID
export const getOrderByIdService = async (customerId, orderId) => {
  const order = await populateOrderDetails(
    Order.findOne({
      _id: orderId,
      customerId,
    }),
  );

  if (!order) {
    throw new Error("Order not found or access denied");
  }

  return order;
};

// ADMIN - GET ALL ORDERS
export const getAllOrdersService = async () => {
  const orders = await populateOrderDetails(
    Order.find().sort({ createdAt: -1 }),
  );

  // Temporary debug log: check customer name returned by MongoDB
  console.log(
    "ORDER CUSTOMER DETAILS:",
    orders.map((order) => ({
      orderId: order._id,
      customerId: order.customerId,
      customerName: order.customerId?.name,
    })),
  );

  return orders;
};

// ADMIN - GET ORDER BY ID
export const getAdminOrderByIdService = async (orderId) => {
  const order = await populateOrderDetails(Order.findById(orderId));

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

  return populateOrderDetails(Order.findById(order._id));
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

  return populateOrderDetails(Order.findById(order._id));
};
