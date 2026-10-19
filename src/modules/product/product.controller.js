import {
  createProductService,
  getProductsService,
  getProductService,
  updateProductService,
  deleteProductService,
} from "./product.service.js";

// CREATE PRODUCT + IMAGES
export const createProduct = async (req, res) => {
  try {
    const { name, slug, categoryId, basePrice } = req.body;

    if (
      !name ||
      !slug ||
      !categoryId ||
      basePrice === undefined ||
      basePrice === ""
    ) {
      return res.status(400).json({
        message: "Name, slug, categoryId and basePrice are required",
      });
    }

    const images = (req.files || []).map(
      (file) => `/uploads/products/${file.filename}`,
    );

    const productData = {
      ...req.body,
      basePrice: Number(basePrice),
      discount: Number(req.body.discount || 0),
      featured: req.body.featured === "true" || req.body.featured === true,
      images,
    };

    const product = await createProductService(productData);

    return res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await getProductsService();

    return res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
export const getProduct = async (req, res) => {
  try {
    const product = await getProductService(req.params.id);

    return res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

// UPDATE PRODUCT + IMAGES
export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(
        (file) => `/uploads/products/${file.filename}`,
      );
    }

    if (updateData.basePrice !== undefined) {
      updateData.basePrice = Number(updateData.basePrice);
    }

    if (updateData.discount !== undefined) {
      updateData.discount = Number(updateData.discount);
    }

    if (updateData.featured !== undefined) {
      updateData.featured =
        updateData.featured === "true" || updateData.featured === true;
    }

    const product = await updateProductService(req.params.id, updateData);

    return res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await deleteProductService(req.params.id);

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
