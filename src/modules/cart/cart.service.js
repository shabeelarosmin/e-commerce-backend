import Cart from "./cart.model.js";
import ProductVariant from "../productVariant/productVariant.model.js";
import Customer from "../customer/customer.model.js";

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.total, 0);
};

// ADD TO CART
export const addToCartService = async (data) => {
  const { customerId, productId, variantId, quantity } = data;

  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  const variant = await ProductVariant.findById(variantId);

  if (!variant) {
    throw new Error("Product variant not found");
  }

  if (!variant.active) {
    throw new Error("Product variant is inactive");
  }

  if (variant.stockQuantity < quantity) {
    throw new Error("Insufficient stock");
  }

  let cart = await Cart.findOne({ customerId });

  if (!cart) {
    cart = await Cart.create({
      customerId,
      items: [],
      totalAmount: 0,
    });
  }

  const existingItem = cart.items.find(
    (item) => item.variantId.toString() === variantId.toString(),
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (variant.stockQuantity < newQuantity) {
      throw new Error("Insufficient stock");
    }

    existingItem.quantity = newQuantity;
    existingItem.price = variant.sellingPrice;
    existingItem.total = newQuantity * variant.sellingPrice;
  } else {
    cart.items.push({
      productId,
      variantId,
      quantity,
      price: variant.sellingPrice,
      total: quantity * variant.sellingPrice,
    });
  }

  cart.totalAmount = calculateTotal(cart.items);

  await cart.save();

  return cart;
};

// GET CART
export const getCartService = async (customerId) => {
  const cart = await Cart.findOne({ customerId })
    .populate("items.productId")
    .populate("items.variantId");

  if (!cart) {
    throw new Error("Cart not found");
  }

  return cart;
};

// UPDATE CART ITEM
export const updateCartItemService = async (
  customerId,
  cartId,
  itemId,
  quantity,
) => {
  const cart = await Cart.findOne({
    _id: cartId,
    customerId,
  });

  if (!cart) {
    throw new Error("Cart not found or access denied");
  }

  const item = cart.items.id(itemId);

  if (!item) {
    throw new Error("Cart item not found");
  }

  const variant = await ProductVariant.findById(item.variantId);

  if (!variant) {
    throw new Error("Product variant not found");
  }

  if (variant.stockQuantity < quantity) {
    throw new Error("Insufficient stock");
  }

  item.quantity = quantity;
  item.price = variant.sellingPrice;
  item.total = quantity * variant.sellingPrice;

  cart.totalAmount = calculateTotal(cart.items);

  await cart.save();

  return cart;
};

// REMOVE CART ITEM
export const removeCartItemService = async (customerId, cartId, itemId) => {
  const cart = await Cart.findOne({
    _id: cartId,
    customerId,
  });

  if (!cart) {
    throw new Error("Cart not found or access denied");
  }

  const item = cart.items.id(itemId);

  if (!item) {
    throw new Error("Cart item not found");
  }

  item.deleteOne();

  cart.totalAmount = calculateTotal(cart.items);

  await cart.save();

  return cart;
};

// CLEAR CART
export const clearCartService = async (customerId, cartId) => {
  const cart = await Cart.findOne({
    _id: cartId,
    customerId,
  });

  if (!cart) {
    throw new Error("Cart not found or access denied");
  }

  cart.items = [];
  cart.totalAmount = 0;

  await cart.save();

  return cart;
};
