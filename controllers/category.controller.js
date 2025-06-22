import mongoose from "mongoose";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

export const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists",
      });
    }
    const category = new Category({ name });
    await category.save();
    return res.status(201).json({
      success: true,
      message: "Category registered successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create Category",
      error: error.message,
    });
  }
};

export const fetchAllCategories = async (_req, res) => {
  try {
    const data = await Category.find();
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Categories list is empty" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Categories fetched", data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Categories",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findById(categoryId);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "category not found" });
    return res
      .status(200)
      .json({ success: true, message: "Category fetched", category });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Category",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategoryName = await Category.findOne({ name });

    if (existingCategoryName && existingCategoryName.name === name) {
      return res.status(400).json({
        success: false,
        message: "Category Already Exists",
      });
    }
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { $set: { name } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cannot Update Category",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const category = Category.findById(categoryId);
    if (!category) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Category Not Found",
      });
    }

    await Product.updateMany(
      { category: categoryId },
      { $unset: { category: "" } },
      { session }
    );

    await Category.findByIdAndDelete(categoryId).session(session);
    session.commitTransaction();
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({
      success: false,
      message: "Failed to delete the Category",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
