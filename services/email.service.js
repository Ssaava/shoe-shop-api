import nodemailer from "nodemailer";
import {
  SERVER_URL,
  EMAIL_USER,
  EMAIL_PASSWORD,
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
      subject: "Verify Email Shoe Shop",
      html: `Your password was recently updated`,
    });
  } catch (err) {
    console.log(err);
  }
};

export default sendVerificationEmail;
