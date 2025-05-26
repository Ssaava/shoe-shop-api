const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sales = mongoose.model("Sales", salesSchema);
module.exports = Sales;
