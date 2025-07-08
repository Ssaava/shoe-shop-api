import nodemailer from "nodemailer";

import {
  EMAIL_PASSWORD,
  EMAIL_USER,
  SERVER_URL,
} from "../config/env.config.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${SERVER_URL}/api/auth/email-verification?token=${token}`;
  try {
    await transporter.sendMail({
      from: `"Shoe Shop" <${EMAIL_USER}>`,
      to: email,
      subject: "Verify Email Shoe Shop",
      html: `Click <a href="${verificationLink}">here</a> to verify your email.`,
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendPasswordChangeNotification = async (email) => {
  try {
    await transporter.sendMail({
      from: `"Shoe Shop" <${EMAIL_USER}>`,
      to: email,
      subject: "Password Change Update",
      html: `Your password was recently updated`,
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendRequestPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `https://frontend.com/reset-password?token=${resetToken}`;
  try {
    await transporter.sendMail({
      from: `"Shoe Shop" <${EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset. Click the link below:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `,
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendCustomEmail = async (email, subject, htmlTemplate) => {
  try {
    await transporter.sendMail({
      from: `"Shoe Shop" <${EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlTemplate,
    });
  } catch (err) {
    console.log(err);
  }
};
export default sendVerificationEmail;
