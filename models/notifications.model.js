const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    message: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
