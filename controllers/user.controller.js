import User from "../models/user.model.js";

// admin route
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "-password -verificationToken -verificationTokenExpires"
    );

    res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userData = req.body;
    const userId = req.userId;

    const restrictedFields = [
      "role",
      "email",
      "password",
      "isVerified",
      "verificationToken",
      "verificationTokenExpires",
    ];

    const attemptedRestrictedUpdates = Object.keys(userData).filter((field) =>
      restrictedFields.includes(field)
    );

    if (attemptedRestrictedUpdates.length > 0) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Cannot update restricted fields: ${attemptedRestrictedUpdates.join(
          ", "
        )}`,
        solution:
          "Use dedicated endpoints for these actions (e.g., /api/user/change-password)",
      });
    }

    restrictedFields.forEach((field) => delete userData[field]);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: userData },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) res.status(404).json({ message: "User Not Found" });

    res
      .status(200)
      .json({ message: "User updated Successfully", data: updatedUser });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Failed to update user" });
  }
};

export const deleteUser = (req, res) => {
  res.status(200).json({ message: "User deleted Successfully" });
};
