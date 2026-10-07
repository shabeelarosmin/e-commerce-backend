import {
  createProductVariantService,
  getProductVariantsService,
  getProductVariantService,
  updateProductVariantService,
  deleteProductVariantService,
} from "./productVariant.service.js";

// CREATE PRODUCT VARIANT
export const createProductVariant = async (req, res) => {
  try {
    const { productId, size, color, sku, sellingPrice } = req.body;

    if (!productId || !size || !color || !sku || sellingPrice === undefined) {
      return res.status(400).json({
        message: "ProductId, size, color, sku and sellingPrice are required",
      });
    }

    const variant = await createProductVariantService(req.body);

    res.status(201).json({
      message: "Product variant created successfully",
      data: variant,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// GET ALL PRODUCT VARIANTS
export const getProductVariants = async (req, res) => {
  try {
    const variants = await getProductVariantsService();

    res.status(200).json({
      message: "Product variants fetched successfully",
      data: variants,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET PRODUCT VARIANT BY ID
export const getProductVariant = async (req, res) => {
  try {
    const variant = await getProductVariantService(req.params.id);

    res.status(200).json({
      message: "Product variant fetched successfully",
      data: variant,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// UPDATE PRODUCT VARIANT
export const updateProductVariant = async (req, res) => {
  try {
    const variant = await updateProductVariantService(req.params.id, req.body);

    res.status(200).json({
      message: "Product variant updated successfully",
      data: variant,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE PRODUCT VARIANT
export const deleteProductVariant = async (req, res) => {
  try {
    await deleteProductVariantService(req.params.id);

    res.status(200).json({
      message: "Product variant deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
