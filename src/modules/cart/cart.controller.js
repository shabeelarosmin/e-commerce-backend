import {
  addToCartService,
  getCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
} from "./cart.service.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    const customerId = req.user?.customerId;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer account is not linked",
      });
    }

    if (!productId || quantity === undefined || quantity === null) {
      return res.status(400).json({
        success: false,
        message: "productId and quantity are required",
      });
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number",
      });
    }

    const cart = await addToCartService({
      customerId,
      productId,
      variantId: variantId || null,
      quantity: parsedQuantity,
    });

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to add product to cart",
    });
  }
};

// GET CART
export const getCart = async (req, res) => {
  try {
    const customerId = req.user?.customerId;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer account is not linked",
      });
    }

    const cart = await getCartService(customerId);

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(404).json({
      success: false,
      message: error.message || "Unable to fetch cart",
    });
  }
};

// UPDATE CART ITEM
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const customerId = req.user?.customerId;
    const parsedQuantity = Number(quantity);

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer account is not linked",
      });
    }

    if (
      quantity === undefined ||
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number",
      });
    }

    const cart = await updateCartItemService(
      customerId,
      req.params.cartId,
      req.params.itemId,
      parsedQuantity,
    );

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Update cart item error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to update cart item",
    });
  }
};

// REMOVE CART ITEM
export const removeCartItem = async (req, res) => {
  try {
    const customerId = req.user?.customerId;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer account is not linked",
      });
    }

    const cart = await removeCartItemService(
      customerId,
      req.params.cartId,
      req.params.itemId,
    );

    return res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to remove cart item",
    });
  }
};

// CLEAR CART
export const clearCart = async (req, res) => {
  try {
    const customerId = req.user?.customerId;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer account is not linked",
      });
    }

    const cart = await clearCartService(customerId, req.params.cartId);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to clear cart",
    });
  }
};
