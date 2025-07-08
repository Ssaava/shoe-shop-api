import Sales from "../models/sales.model.js";

export const getAllSales = async (_req, res) => {
  try {
    const sales = await Sales.find().populate({
      path: "order",
      populate: [
        {
          path: "user",
          select: "firstname lastname email contact",
        },
        {
          path: "products.product",
          select:
            "name price stock gender images payment_method total_price delivered_at cancelled_at",
        },
      ],
    });
    if (!sales) {
      return res
        .status(404)
        .json({ success: false, message: "Sales Not Found" });
    }
    return res.status(200).json({ success: false, sales });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
