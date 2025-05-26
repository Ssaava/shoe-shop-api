import Product from "../models/product.model";

export const registerProduct = async (_req, res) => {
  try {
    const product = new Product(_req.body);
    await product.save();
    res
      .status(201)
      .json({ message: "Product registered successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering the product", error: error.message });
  }
};

export const getProducts = async (_req, res) => {
  try {
    const products = await Product.find().populate("brandId categoryId");
    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching the product", error: error.message });
  }
};

export const getSingleProduct = async (_req, res) => {
  try {
    const product = await Product.findById(_req.params.id).populate(
      "brandId categoryId"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching the product", error: error.message });
  }
};

export const updateProduct = (_req, res) => {
  res.status(200).json({ message: "Product updated successfully" });
};

export const deleteProduct = (_req, res) => {
  res.status(200).json({ message: "Product deleted Successfully" });
};
