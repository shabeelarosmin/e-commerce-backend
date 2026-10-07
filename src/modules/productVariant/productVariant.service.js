import ProductVariant from "./productVariant.model.js";
import Product from "../product/product.model.js";

// CREATE PRODUCT VARIANT
export const createProductVariantService = async (data) => {
  const {
    productId,
    size,
    color,
    sku,
    sellingPrice,
    stockQuantity,
    reservedQuantity,
    active,
  } = data;

  // CHECK PRODUCT
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // CHECK DUPLICATE SKU
  const existingVariant = await ProductVariant.findOne({ sku });

  if (existingVariant) {
    throw new Error("SKU already exists");
  }

  // CREATE VARIANT
  const variant = await ProductVariant.create({
    productId,
    size,
    color,
    sku,
    sellingPrice,
    stockQuantity,
    reservedQuantity,
    active,
  });

  return variant;
};

// GET ALL PRODUCT VARIANTS
export const getProductVariantsService = async () => {
  return await ProductVariant.find()
    .populate("productId", "name slug")
    .sort({ createdAt: -1 });
};

// GET PRODUCT VARIANT BY ID
export const getProductVariantService = async (id) => {
  const variant = await ProductVariant.findById(id).populate(
    "productId",
    "name slug",
  );

  if (!variant) {
    throw new Error("Product variant not found");
  }

  return variant;
};

// UPDATE PRODUCT VARIANT
export const updateProductVariantService = async (id, data) => {
  // CHECK PRODUCT IF productId IS UPDATED
  if (data.productId) {
    const product = await Product.findById(data.productId);

    if (!product) {
      throw new Error("Product not found");
    }
  }

  // CHECK DUPLICATE SKU
  if (data.sku) {
    const existingVariant = await ProductVariant.findOne({
      sku: data.sku,
      _id: { $ne: id },
    });

    if (existingVariant) {
      throw new Error("SKU already exists");
    }
  }

  // UPDATE VARIANT
  const variant = await ProductVariant.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("productId", "name slug");

  if (!variant) {
    throw new Error("Product variant not found");
  }

  return variant;
};

// DELETE PRODUCT VARIANT
export const deleteProductVariantService = async (id) => {
  const variant = await ProductVariant.findByIdAndDelete(id);

  if (!variant) {
    throw new Error("Product variant not found");
  }

  return variant;
};
