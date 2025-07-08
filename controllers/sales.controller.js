import Sales from "../models/sales.model.js";

export const getAllSales = async (_req, res) => {
  try {
    const sales = await Sales.find().populate("order");
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
