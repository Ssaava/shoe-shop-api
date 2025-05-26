const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  totalExpense: { type: String },
  paymentStatus: { type: String },
  orderStatus: { type: String },
  deliveryStatus: { type: String },
  prooductId: { type: [String] },
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;