import mongoose from "mongoose";
import Brand from "../models/brand.model.js";
import Product from "../models/product.model.js";

export const createBrand = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Brand name already exists",
      });
    }
    const brand = new Brand({ name });
    await brand.save();
    return res
      .status(201)
      .json({ success: true, message: "Brand registered successfully", brand });
  } catch (error) {
    console.log("Brand Creation Error:  ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create brand",
      error: error.message,
    });
  }
};

export const fetchAllBrands = async (_req, res) => {
  try {
    const data = await Brand.find();
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Brands list is empty" });
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch brands",
      error: error.message,
    });
  }
};

export const getBrandById = async (req, res) => {
  const { brandId } = req.params;
  try {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }
    return res.status(200).json({ success: true, brand });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Fetch Brand",
      error: error.message,
    });
  }
};

export const updateBrand = async (req, res) => {
  const { brandId } = req.params;
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }
    const existingBrandName = await Brand.findOne({ name });

    if (existingBrandName && existingBrandName.name === name) {
      return res.status(400).json({
        success: false,
        message: "Brand Already Exists",
      });
    }
    const brand = await Brand.findByIdAndUpdate(
      brandId,
      { $set: { name } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }
    return res.status(200).json({ success: true, brand });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Brand",
      error: error.message,
    });
  }
};

export const deleteBrand = async (req, res) => {
  const { brandId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }
    await Product.updateMany(
      { brand: brandId },
      { $unset: { brand: "" } },
      { session }
    );

    await Brand.findByIdAndDelete(brandId).session(session);
    await session.commitTransaction();
    return res
      .status(200)
      .json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    console.log("Brand Delete Error: ", error);
    await session.abortTransaction();
    return res.status(500).json({
      success: false,
      message: "Failed to delete brand",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
