import models from "../models/category.model.js";

const { Category } = models;

export const addCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res
      .status(201)
      .json({ message: "Category registered successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "category not found" });
    return res.status(200).json({ message: "Category fetched", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (_req, res) => {
  try {
    const category = await Category.find();
    if (!category)
      return res.status(404).json({ message: "Categories not found" });

    return res.status(200).json({ message: "Categories fetched", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "category not found", category });
    res
      .status(200)
      .json({ message: "Category deleted successfully", category });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    return res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
