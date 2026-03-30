import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false, // Don't return password by default
    },
    // Business Profile Fields
    businessName: String,
    businessAddress: String,
    businessTaxId: String,
    businessLogo: String, // URL to the logo
  },
  { timestamps: true }
);

// This is a common pattern in Next.js to prevent re-compiling the model during HMR
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
