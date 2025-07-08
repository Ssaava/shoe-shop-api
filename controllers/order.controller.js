import Order from "../models/order.model.js";
import Cart from "../models/cart.models.js";
import Sales from "../models/sales.model.js";
import { sendShippedStatusEmail } from "../services/email.service.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Shipping address and payment method are required.",
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    if (!cart || cart.products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty." });
    }

    const orderProducts = cart.products.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
      size: item.size || null,
    }));

    const totalPrice = cart.totalCost;

    const order = new Order({
      user: userId,
      products: orderProducts,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      total_price: totalPrice,
    });

    await order.save();

    // Clear the cart after placing order
    cart.products = [];
    cart.totalCost = 0;
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate({ path: "products.product" })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ user: userId }).populate(
      "products.product"
    );
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { status, orderId } = req.body;
  try {
    if (status != "shipped" && status != "delivered" && status != "cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order Status" });
    }

    const order = await Order.findById(orderId)
      .populate({
        path: "user",
        select: "firstname lastname email",
      })
      .populate({
        path: "products.product",
        select: "name images",
      });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (
      order.order_status === "delivered" ||
      order.order_status === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: `Order already marked as ${order.order_status}`,
      });
    }
    let updatedOrder = { order_status: status };
    if (status == "delivered") {
      updatedOrder.delivered_at = new Date();
      updatedOrder.payment_status = "completed";
    }
    if (status == "cancelled") {
      updatedOrder.cancelled_at = new Date();
      updatedOrder.payment_status = "failed";
    }

    if (status == "shipped") {
      sendShippedStatusEmail(order.user.email, order);
    }

    const patchedOrder = await Order.findByIdAndUpdate(orderId, updatedOrder);
    if (!patchedOrder) {
      return res
        .status(400)
        .json({ success: false, message: "Failed update order status" });
    }

    let sales;
    if (status === "delivered") {
      sales = new Sales({ order: patchedOrder._id });
      await sales.save();
    }

    return res.status(200).json({
      success: true,
      message: `Order has been ${status} Successfully`,
      sales,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Cancel order (user controller)
export const cancelOrder = async (req, res) => {
  const { status, orderId } = req.body;
  try {
    if (status != "cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order Status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (
      order.order_status === "delivered" ||
      order.order_status === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: `Order already marked as ${order.order_status}`,
      });
    }

    if (order.order_status === "shipped") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel Already Shipped Order`,
      });
    }
    let updatedOrder = {
      order_status: status,
      cancelled_at: new Date(),
      payment_status: "failed",
    };

    const patchedOrder = await Order.findByIdAndUpdate(orderId, updatedOrder);
    if (!patchedOrder) {
      return res
        .status(400)
        .json({ success: false, message: "Failed update order status" });
    }

    return res.status(200).json({
      success: true,
      message: `Order has been ${status} Successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
