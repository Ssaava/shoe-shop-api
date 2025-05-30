import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  sendPasswordChangeNotification,
  sendRequestPasswordResetEmail,
} from "../services/email.service.js";
import crypto from "crypto";
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

    const allowedUpdates = [
      "firstname",
      "lastname",
      "email",
      "image",
      "coverPhoto",
      "contact",
    ];
    const updates = Object.keys(req.body).filter((key) =>
      allowedUpdates.includes(key)
    );

    if (updates.length <= 0) {
      return res
        .status(403)
        .json({ success: false, message: "You cannot edit user information" });
    }

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

export const updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId;

    if (oldPassword == newPassword) {
      return res
        .status(403)
        .json({ success: false, message: "Passwords cannot be the same" });
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordSame = await bcrypt.compareSync(oldPassword, user.password);

    if (!isPasswordSame) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hashSync(newPassword, 10);
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      refreshTokens: [],
    });

    sendPasswordChangeNotification(user.email);

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.status(200).json({ message: "Password updated Successfully" });
  } catch (err) {
    console.log("password update error: ", err);
    res.status(401).json({ message: "Failed to update password" });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // 3. Send reset email
    sendRequestPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      success: true,
      message: "Reset link sent to email",
    });
  } catch (err) {
    console.error("Reset request error:", err);
    res.status(500).json({
      success: false,
      message: "Error processing reset request",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hashSync(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    user.refreshTokens = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
};

/**
 * TODO; To be implemented if needed
 */

export const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;
    await User.findByIdAndDelete(userId);
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res
      .status(200)
      .json({ success: true, message: "User account deleted successfully" });
  } catch (err) {
    console.log("Delete User Error: ", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
