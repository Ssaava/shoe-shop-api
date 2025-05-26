import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
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
    street: String,
    city: String,
    country: String,
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
  shippingPrice: { type: String, default: 0 },
  deliveredAt: Date,
});

const Order = mongoose.model("Order", orderSchema);
export { Order };
