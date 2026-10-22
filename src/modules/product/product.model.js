import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Product name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Unique product slug
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Product category
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Product description
    description: {
      type: String,
      default: "",
    },

    // Product images
    images: {
      type: [String],
      default: [],
    },

    // Brand name
    brand: {
      type: String,
      default: "",
      trim: true,
    },

    // Base product price
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Stock for products without variants
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Product discount
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Product status
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // Featured product
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
