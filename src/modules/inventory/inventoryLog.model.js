import mongoose from "mongoose";

const inventoryLogSchema = new mongoose.Schema(
  {
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },

    type: {
      type: String,
      enum: ["IN", "OUT", "ADJUSTMENT", "RESERVED", "RELEASED"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    previousStock: {
      type: Number,
      required: true,
      min: 0,
    },

    newStock: {
      type: Number,
      required: true,
      min: 0,
    },

    reason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const InventoryLog = mongoose.model("InventoryLog", inventoryLogSchema);

export default InventoryLog;
