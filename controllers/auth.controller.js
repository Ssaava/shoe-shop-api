import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendVerificationEmail from "../services/email.service.js";
import { TOKEN_SECRET_KEY } from "../config/env.config.js";
export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, contact } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({ message: "User already exists" });
    }
    const existingContact = await User.findOne({ contact });
    if (existingContact) {
      return res.status(403).json({ message: "Contact already Registered" });
    }
    const hashedPassword = await bcrypt.hashSync(password, 10);

    const verificationToken = crypto.randomBytes(20).toString("hex");

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      contact,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // expired in 24 hours
    });
    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: "Verification Email Sent" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }, // check expiry
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or Expired token" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.json({ message: "Email Verified" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resendVerificationLink = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      res.status(400).json({ message: "User already Verified" });
    }

    const newToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = newToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(email, newToken);

    res.json({ message: "New Verification Link Sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User does not exist" });
    }
    const checkPassword = await bcrypt.compareSync(password, user.password);
    if (!checkPassword) {
      res.status(401).json({ message: "Passwords do not match" });
    }

    const token = jwt.sign(
      { userId: user._id, userRole: user.role },
      TOKEN_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res
      .status(200)
      .json({ message: "User Logged in successfully", token, user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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
  //update a user by ID

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
