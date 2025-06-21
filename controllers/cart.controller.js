import Cart from "../models/cart.models.js";
import Product from "../models/product.model.js";

// Add product to cart (create or update existing cart)
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.userId;
  try {
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product Id or Quantity invalid",
      });
    }
    if (!userId) return res.status(401).json({ message: "Unauthenticated" });
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Product Quantity should be greater than 1",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity, price: product.price }],
        totalCost: quantity * product.price,
      });
    }

    const existingItemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.products[existingItemIndex].quantity = quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }
    cart.totalCost = cart.products.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    await cart.save();
    return res
      .status(200)
      .json({ success: true, message: "Product Added to Cart", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's cart
export const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate(
      "products.product"
    );
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    return res
      .status(200)
      .json({ success: true, message: "Cart fetched successfully", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
  const { productIds } = req.body;
  const userId = req.userId;

  try {
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid product IDs array",
      });
    }
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    const initialProductCount = cart.products.length;
    const updatedProducts = cart.products.filter(
      (p) => !productIds.includes(p.product._id.toString())
    );
    if (updatedProducts.length === initialProductCount) {
      return res.status(400).json({
        success: false,
        message: "No matching products found in cart",
        cart,
      });
    }
    const newTotal = updatedProducts.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    if (updatedProducts.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.status(200).json({
        success: true,
        message: "All items removed - cart deleted",
        cart: null,
      });
    }
    const updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      {
        products: updatedProducts,
        totalCost: newTotal,
      },
      { new: true, runValidators: true }
    ).populate("products.product");

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ user: req.userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    return res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
