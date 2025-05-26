const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
});

const Sales = mongoose.model("Sales", salesSchema);
module.exports = Sales;