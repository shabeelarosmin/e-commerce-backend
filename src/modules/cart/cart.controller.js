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

    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    if (!productId || !variantId || !quantity) {
      return res.status(400).json({
        message: "productId, variantId and quantity are required",
      });
    }

    const cart = await addToCartService({
      customerId,
      productId,
      variantId,
      quantity,
    });

    res.status(200).json({
      message: "Product added to cart successfully",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// GET CART
export const getCart = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    const cart = await getCartService(customerId);

    res.status(200).json({
      data: cart,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// UPDATE CART ITEM
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Valid quantity is required",
      });
    }

    const cart = await updateCartItemService(
      customerId,
      req.params.cartId,
      req.params.itemId,
      quantity,
    );

    res.status(200).json({
      message: "Cart item updated successfully",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// REMOVE CART ITEM
export const removeCartItem = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    const cart = await removeCartItemService(
      customerId,
      req.params.cartId,
      req.params.itemId,
    );

    res.status(200).json({
      message: "Cart item removed successfully",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// CLEAR CART
export const clearCart = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    const cart = await clearCartService(customerId, req.params.cartId);

    res.status(200).json({
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
