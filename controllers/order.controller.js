// controllers/order.controller.js
import Order from "../models/order.model.js";
import Cart from "../models/cart.models.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { shippingAddress, paymentMethod, shippingPrice = 0 } = req.body;

    // Validate
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Shipping address and payment method are required." });
    }

    const cart = await Cart.findOne({ user: userId }).populate("products.product");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const orderProducts = cart.products.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
      size: item.size || null,
    }));

    const totalPrice = cart.totalCost + Number(shippingPrice);

    const order = new Order({
      user: userId,
      products: orderProducts,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      totalPrice,
    });

    await order.save();

    // Clear the cart after placing order
    cart.products = [];
    cart.totalCost = 0;
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("products.product");
    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Get current user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ user: userId }).populate("products.product");
    res.status(200).json({ message: "User orders fetched", orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Mark order as delivered (admin only)
export const markAsDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = "delivered";
    order.paymentStatus = "completed";
    order.deliveredAt = new Date();

    await order.save();
    res.status(200).json({ message: "Order marked as delivered", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
};

// Cancel an order (user or admin)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only allow the user who placed the order or an admin to cancel
    if (order.user.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order", error: error.message });
  }
};
