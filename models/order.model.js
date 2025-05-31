import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        size: String,
      },
    ],
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      country: { type: String },
      phoneNumber: { type: String },
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "cash"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    totalPrice: { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    deliveredAt: Date,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
