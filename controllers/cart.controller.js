import Brand from "../models/brand.model.js";
import Cart from "../models/cart.models.js";

export const addCart = async (req, res) => {
  try {
    const cart = new Cart(req.body);
    await Brand.save();
    res.status(201).json({ message: "Item added to cart successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCartItems = async (_req, res) => {
  try {
    const cart = Cart.find();
    if (!cart) {
      return res.status(404).json({ message: "No items found in cart!!" });
    }
    return res
      .status(200)
      .json({ message: "Items fetched successfully", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCartItem = async (req, res) => {
  try {
    const cart = await cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item fetched successfully", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!cart) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ message: "Item updated successfully", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) return res.status(404).json({ message: "Item not found" });
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
