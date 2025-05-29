import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/user.model.js";
import sendVerificationEmail from "../services/email.service.js";
import { generateToken } from "../utils/utils.js";
import { REFRESH_TOKEN_SECRET } from "../config/env.config.js";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, contact } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(403)
        .json({ success: false, message: "User already exists" });
    }
    const existingContact = await User.findOne({ contact });
    if (existingContact) {
      return res
        .status(403)
        .json({ success: false, message: "Contact already Registered" });
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

    res.status(201).json({ success: true, message: "Verification Email Sent" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid or Expired token" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.json({ message: "Email Verified" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const resendVerificationLink = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.isVerified) {
      res
        .status(400)
        .json({ success: false, message: "User already Verified" });
    }

    const newToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = newToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(email, newToken);

    res
      .status(200)
      .json({ success: true, message: "New Verification Link Sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: "User does not exist" });
    }
    const checkPassword = await bcrypt.compareSync(password, user.password);
    if (!checkPassword) {
      res.status(401).json({ message: "Passwords do not match" });
    }

    const { access_token, refresh_token } = generateToken(user);

    user.refreshTokens.push({
      token: refresh_token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await user.save();

    res.cookie("accessToken", access_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "User Logged in successfully",
      access_token,
      refresh_token,
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isVerified: user.isVerified,
        contact: user.contact,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "refresh token not found" });
    }

    const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const user = await User.findOne({
      _id: decodedToken.userId,
      "refreshTokens.token": refreshToken,
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });

    const { access_token, refresh_token } = generateToken(user);

    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.token !== refreshToken
    );
    user.refreshTokens.push({
      token: refresh_token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await user.save();
    res.cookie("refreshToken", refresh_token, {
      maxAge: 24 * 60 * 60 * 10000,
      secure: true,
      httpOnly: true,
    });

    res.cookie("accessToken", access_token, {
      maxAge: 7 * 24 * 60 * 60 * 10000,
      secure: true,
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "token refreshed successfully",
      access_token,
      refresh_token,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await User.updateOne(
      { _id: req.userId },
      { $pull: { refreshTokens: { token: refreshToken } } }
    );
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
      .json({ success: true, message: "User Logged Out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
