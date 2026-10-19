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
    const body = req.body || {};

    // Frontend ProductId അല്ലെങ്കിൽ productId അയച്ചാലും സ്വീകരിക്കും
    const productId = body.productId ?? body.ProductId;
    const { size, color, sku, sellingPrice } = body;

    if (
      !productId ||
      !String(size ?? "").trim() ||
      !String(color ?? "").trim() ||
      !String(sku ?? "").trim() ||
      sellingPrice === undefined ||
      sellingPrice === null ||
      String(sellingPrice).trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "ProductId, size, color, sku and sellingPrice are required",
      });
    }

    const price = Number(sellingPrice);
    const stock = Number(body.stockQuantity ?? 0);

    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Selling price must be a valid non-negative number.",
      });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity must be a non-negative integer.",
      });
    }

    // Service/model ഉപയോഗിക്കാൻ standard field names
    const variantData = {
      ...body,
      productId,
      size: String(size).trim(),
      color: String(color).trim(),
      sku: String(sku).trim(),
      sellingPrice: price,
      stockQuantity: stock,
    };

    // Model/service lowercase productId ഉപയോഗിക്കുന്നതിനാൽ
    // duplicate uppercase field ഒഴിവാക്കുന്നു.
    delete variantData.ProductId;

    const variant = await createProductVariantService(variantData);

    return res.status(201).json({
      success: true,
      message: "Product variant created successfully",
      data: variant,
    });
  } catch (error) {
    console.error("Create product variant error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PRODUCT VARIANTS
export const getProductVariants = async (req, res) => {
  try {
    const variants = await getProductVariantsService();

    return res.status(200).json({
      success: true,
      message: "Product variants fetched successfully",
      data: variants,
    });
  } catch (error) {
    console.error("Get product variants error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PRODUCT VARIANT BY ID
export const getProductVariant = async (req, res) => {
  try {
    const variant = await getProductVariantService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product variant fetched successfully",
      data: variant,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PRODUCT VARIANT
export const updateProductVariant = async (req, res) => {
  try {
    const body = { ...(req.body || {}) };

    // Frontend field name normalize ചെയ്യുന്നു
    if (body.productId === undefined && body.ProductId !== undefined) {
      body.productId = body.ProductId;
    }

    delete body.ProductId;

    if (body.sellingPrice !== undefined) {
      const price = Number(body.sellingPrice);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: "Selling price must be a valid non-negative number.",
        });
      }

      body.sellingPrice = price;
    }

    if (body.stockQuantity !== undefined) {
      const stock = Number(body.stockQuantity);

      if (!Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock quantity must be a non-negative integer.",
        });
      }

      body.stockQuantity = stock;
    }

    const variant = await updateProductVariantService(req.params.id, body);

    return res.status(200).json({
      success: true,
      message: "Product variant updated successfully",
      data: variant,
    });
  } catch (error) {
    console.error("Update product variant error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE PRODUCT VARIANT
export const deleteProductVariant = async (req, res) => {
  try {
    await deleteProductVariantService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product variant deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
