import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    message: { type: String },
    user: {
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
export { Notification };
