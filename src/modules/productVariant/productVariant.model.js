import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    size: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    reservedQuantity: {
      type: Number,
      min: 0,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);

export default ProductVariant;
