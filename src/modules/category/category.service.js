import Category from "./category.model.js";

export const createCategoryService = async (data) => {
  const { name, slug, image, description } = data;

  const existingCategory = await Category.findOne({ slug });

  if (existingCategory) {
    throw new Error("Category with this slug already exists");
  }

  const category = await Category.create({
    name,
    slug,
    image,
    description,
  });

  return category;
};

export const getCategoriesService = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

export const getCategoryService = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const updateCategoryService = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const deleteCategoryService = async (id) => {
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};
