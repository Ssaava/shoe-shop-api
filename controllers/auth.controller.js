import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendVerificationEmail from "../services/email.service.js";

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

export const getUser = (req, res) => {
  //get a user by ID
  try {
    const userId = req.params.id;
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

export const updateUser = (req, res) => {
  //update a user by ID
  const userId = req.params.id;
  const {
    firstname,
    lastName,
    email,
    contact,
    profileImage,
    coverPhoto,
    address,
  } = req.body;
  User.findByIdAndUpdate(
    userId,
    { firstname, lastName, email, contact, profileImage, coverPhoto, address },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    });
};
export const deleteUser = (req, res) => {
  res.status(200).json({ message: "User deleted Successfully" });
};
