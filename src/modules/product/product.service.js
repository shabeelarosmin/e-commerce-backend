import Product from "./product.model.js";
import Category from "../category/category.model.js";

export const createProductService = async (data) => {
  const {
    name,
    slug,
    categoryId,
    description,
    images,
    brand,
    basePrice,
    discount,
    status,
    featured,
  } = data;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  const existingProduct = await Product.findOne({ slug });

  if (existingProduct) {
    throw new Error("Product with this slug already exists");
  }

  const product = await Product.create({
    name,
    slug,
    categoryId,
    description,
    images,
    brand,
    basePrice,
    discount,
    status,
    featured,
  });

  return product;
};

export const getProductsService = async () => {
  return await Product.find()
    .populate("categoryId", "name slug")
    .sort({ createdAt: -1 });
};

export const getProductService = async (id) => {
  const product = await Product.findById(id).populate(
    "categoryId",
    "name slug",
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const updateProductService = async (id, data) => {
  if (data.categoryId) {
    const category = await Category.findById(data.categoryId);

    if (!category) {
      throw new Error("Category not found");
    }
  }

  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("categoryId", "name slug");

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const deleteProductService = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};
