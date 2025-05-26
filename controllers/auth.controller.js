import User from "../models/user.model";

export const registerUser = async (_req, res) => {
  try {
    const { firstname, lastName, email, password, contact } = _req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      firstname,
      lastName,
      email,
      password,
      contact,
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = (_req, res) => {
  //get a user by ID
  try {
    const userId = _req.params.id;
    User.findById(userId).then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = (_req, res) => {
  //update a user by ID
  const userId = _req.params.id;
  const { firstname, lastName, email, contact, profileImage, coverPhoto, address } = _req.body;
  User.findByIdAndUpdate(
    userId,
    { firstname, lastName, email, contact, profileImage, coverPhoto, address },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    });
}
export const deleteUser = (_req, res) => {
  res.status(200).json({ message: "User deleted Successfully" });
};
