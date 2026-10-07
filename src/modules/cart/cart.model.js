import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },
  },
  { _id: true },
);

const cartSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
