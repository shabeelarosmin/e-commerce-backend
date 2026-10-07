import {
  createProductService,
  getProductsService,
  getProductService,
  updateProductService,
  deleteProductService,
} from "./product.service.js";

export const createProduct = async (req, res) => {
  try {
    const { name, slug, categoryId, basePrice } = req.body;

    if (!name || !slug || !categoryId || basePrice === undefined) {
      return res.status(400).json({
        message: "Name, slug, categoryId and basePrice are required",
      });
    }

    const product = await createProductService(req.body);

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await getProductsService();

    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await getProductService(req.params.id);

    res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await updateProductService(req.params.id, req.body);

    res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await deleteProductService(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
