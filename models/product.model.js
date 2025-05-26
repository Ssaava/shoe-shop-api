const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: FLoat, required: true },
  stock: { type: String },
  gender: { type: String },
  description: { type: String },
  images: { type: [String] },
  size: { type: String },
  totalSales: { type: Number },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
