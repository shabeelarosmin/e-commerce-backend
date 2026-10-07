import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    method: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    transactionId: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
