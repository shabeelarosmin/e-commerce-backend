import Cart from "./cart.model.js";
import Product from "../product/product.model.js";
import ProductVariant from "../productVariant/productVariant.model.js";
import Customer from "../customer/customer.model.js";

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + Number(item.total || 0), 0);
};

// GET PRODUCT DETAILS AND VALIDATE STOCK
const getProductDetails = async (productId, variantId = null) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.status !== "active") {
    throw new Error("Product is inactive");
  }

  // PRODUCT WITH VARIANT
  if (variantId) {
    const variant = await ProductVariant.findById(variantId);

    if (!variant) {
      throw new Error("Product variant not found");
    }

    if (String(variant.productId) !== String(product._id)) {
      throw new Error("Selected variant does not belong to this product");
    }

    if (variant.active !== true) {
      throw new Error("Product variant is inactive");
    }

    const availableStock =
      Number(variant.stockQuantity || 0) -
      Number(variant.reservedQuantity || 0);

    if (availableStock <= 0) {
      throw new Error("Selected variant is out of stock");
    }

    return {
      product,
      variant,
      price: Number(variant.sellingPrice),
      availableStock,
    };
  }

  // CHECK WHETHER THE PRODUCT HAS ACTIVE VARIANTS
  const hasVariants = await ProductVariant.exists({
    productId: product._id,
    active: true,
  });

  // Variant products require a variant selection.
  if (hasVariants) {
    throw new Error("Please select a size or product variant");
  }

  // PRODUCT WITHOUT VARIANT
  const availableStock = Number(product.stockQuantity || 0);

  if (availableStock <= 0) {
    throw new Error("Product is out of stock");
  }

  return {
    product,
    variant: null,
    price: Number(product.basePrice),
    availableStock,
  };
};

// ADD TO CART
export const addToCartService = async (data) => {
  const { customerId, productId, variantId = null, quantity } = data;

  if (!customerId || !productId) {
    throw new Error("Customer ID and Product ID are required");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer");
  }

  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  const { price, availableStock } = await getProductDetails(
    productId,
    variantId,
  );

  let cart = await Cart.findOne({ customerId });

  if (!cart) {
    cart = await Cart.create({
      customerId,
      items: [],
      totalAmount: 0,
    });
  }

  // Find matching cart item
  const existingItem = cart.items.find((item) => {
    if (variantId) {
      return String(item.variantId || "") === String(variantId);
    }

    return String(item.productId) === String(productId) && !item.variantId;
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > availableStock) {
      throw new Error(`Only ${availableStock} item(s) are currently available`);
    }

    existingItem.quantity = newQuantity;
    existingItem.price = price;
    existingItem.total = newQuantity * price;
  } else {
    if (quantity > availableStock) {
      throw new Error(`Only ${availableStock} item(s) are currently available`);
    }

    const newItem = {
      productId,
      quantity,
      price,
      total: quantity * price,
    };

    if (variantId) {
      newItem.variantId = variantId;
    }

    cart.items.push(newItem);
  }

  cart.totalAmount = calculateTotal(cart.items);

  await cart.save();

  return Cart.findById(cart._id)
    .populate("items.productId")
    .populate("items.variantId");
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
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer");
  }

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

  const { price, availableStock } = await getProductDetails(
    item.productId,
    item.variantId || null,
  );

  if (quantity > availableStock) {
    throw new Error(`Only ${availableStock} item(s) are currently available`);
  }

  item.quantity = quantity;
  item.price = price;
  item.total = quantity * price;

  cart.totalAmount = calculateTotal(cart.items);

  await cart.save();

  return Cart.findById(cart._id)
    .populate("items.productId")
    .populate("items.variantId");
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

  return Cart.findById(cart._id)
    .populate("items.productId")
    .populate("items.variantId");
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
