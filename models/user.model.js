import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    contact: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: [
      {
        street: String,
        city: String,
        countryCode: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    image: { type: String },
    coverPhoto: { type: String },
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
