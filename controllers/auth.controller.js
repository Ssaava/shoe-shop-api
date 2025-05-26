export const registerUser = (_req, res) => {
  res.status(200).json({ message: "User registered successfully" });
};

export const getUser = (_req, res) => {
  res.status(200).json({ message: "hello get User" });
};

export const updateUser = (_req, res) => {
  res.status(200).json({ message: "User updated successfully" });
};

export const deleteUser = (_req, res) => {
  res.status(200).json({ message: "User deleted Successfully" });
};
