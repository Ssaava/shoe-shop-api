export const registerProduct = (_req, res) => {
  res.status(200).json({ message: "Product registered successfully" });
};

export const getProduct = (_req, res) => {
  res.status(200).json({ message: "hello get Product" });
};

export const updateProduct = (_req, res) => {
  res.status(200).json({ message: "Product updated successfully" });
};

export const deleteProduct = (_req, res) => {
  res.status(200).json({ message: "Product deleted Successfully" });
};
