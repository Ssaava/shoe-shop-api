export const registerUser = (req, res) => {
  console.log("Registering User");
};

export const getUserInfo = (_req, res) => {
  console.log("Getting user data");
  res.status(200).json({ message: "hello get User" });
};
