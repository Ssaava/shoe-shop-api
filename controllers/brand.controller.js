import Brand from "../models/brand.model.js";

export const registerBrand = async (req, res) => {
  try {
    const brand = new Brand(req.body);
    await brand.save();
    res.status(201).json({ message: "Brand registered successfully", brand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBrands = async (_req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({ message: "Brands fetched", brands });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    return res.status(200).json({ message: "Brand Fetched", brand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    return res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    return res.status(200).json({ message: "Brand updated", brand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
