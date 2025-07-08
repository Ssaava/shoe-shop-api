import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { fileURLToPath } from "url";

import {
  SERVER_URL,
  EMAIL_USER,
  EMAIL_PASSWORD,
} from "../config/env.config.js";
import { mapShippedOrderToEmailTemplateData } from "../utils/utils.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export const sendShippedStatusEmail = async (email, data) => {
  const templateData = mapShippedOrderToEmailTemplateData(data);
  const filePath = path.join(
    __dirname,
    "../templates/order-shipped.template.html"
  );
  const source = fs.readFileSync(filePath, "utf8");
  const template = handlebars.compile(source);
  const htmlToSend = template(templateData);
  try {
    await transporter.sendMail({
      from: `"Shoe Shop" <${EMAIL_USER}>`,
      to: email,
      subject: `Your Order has been Shipped`,
      html: htmlToSend,
    });
  } catch (err) {
    console.log(err);
  }
};

export default sendVerificationEmail;
