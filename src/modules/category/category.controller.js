import {
  createCategoryService,
  getCategoriesService,
  getCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "./category.service.js";

export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        message: "Name and slug are required",
      });
    }

    const category = await createCategoryService(req.body);

    res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await getCategoriesService();

    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await getCategoryService(req.params.id);

    res.status(200).json({
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await updateCategoryService(req.params.id, req.body);

    res.status(200).json({
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await deleteCategoryService(req.params.id);

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
