import dayjs from "dayjs"; // optional for formatting date nicely
import jwt from "jsonwebtoken";
import {
  TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET,
} from "../config/env.config.js";
export const generateToken = (user) => {
  const access_token = jwt.sign(
    { userId: user._id, userRole: user.role },
    TOKEN_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  const refresh_token = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { access_token, refresh_token };
};

export const mapShippedOrderToEmailTemplateData = (order) => {
  return {
    customer_firstname: order.user.firstname,
    order_number: order._id,
    products: order.products.map((item) => ({
      product_name: item.product.name,
      quantity: item.quantity,
      price: `UGX ${item.price.toLocaleString()}`, // Format with commas
    })),
    delivery_city: order.shipping_address.city,
    delivery_date: dayjs(order.createdAt).add(2, "days").format("MMMM D, YYYY"), // Estimate delivery
    payment_method: order.payment_method,
    order_total: `UGX ${order.total_price.toLocaleString()}`,
    tracking_link: `https://yourshop.com/track-order/${order._id}`,
    unsubscribe_link: "https://yourshop.com/unsubscribe",
    privacy_policy_link: "https://yourshop.com/privacy-policy",
  };
};

export const mapOrderToDeliveredEmailData = (order) => ({
  customer_firstname: order.user.firstname,
  order_number: order._id,
  products: order.products.map((item) => ({
    product_name: item.product.name,
    quantity: item.quantity,
    price: `UGX ${item.price.toLocaleString("en-UG")}`,
  })),
  order_total: `UGX ${order.total_price.toLocaleString("en-UG")}`,
  unsubscribe_link: "https://yourshop.com/unsubscribe",
  privacy_policy_link: "https://yourshop.com/privacy-policy",
});

export const mapOrderToCancelledEmailData = (order) => ({
  customer_firstname: order.user.firstname,
  order_number: order._id,
  products: order.products.map((item) => ({
    product_name: item.product.name,
    quantity: item.quantity,
    price: `UGX ${item.price.toLocaleString("en-UG")}`,
  })),
  order_total: `UGX ${order.total_price.toLocaleString("en-UG")}`,
  unsubscribe_link: "https://yourshop.com/unsubscribe",
  privacy_policy_link: "https://yourshop.com/privacy-policy",
});

export const mapOrderToProcessingEmailData = (order) => ({
  customer_firstname: order.user.firstname,
  order_number: order._id,
  products: order.products.map((item) => ({
    product_name: item.product.name,
    quantity: item.quantity,
    price: `UGX ${item.price.toLocaleString("en-UG")}`,
  })),
  order_total: `UGX ${order.total_price.toLocaleString("en-UG")}`,
  delivery_city: order.shipping_address.city,
  tracking_link: `https://yourshop.com/track-order/${order._id}`,
  unsubscribe_link: "https://yourshop.com/unsubscribe",
  privacy_policy_link: "https://yourshop.com/privacy-policy",
});
