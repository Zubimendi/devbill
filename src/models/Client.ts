import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a client name"],
    },
    email: {
      type: String,
      required: [true, "Please provide a client email"],
      lowercase: true,
    },
    company: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure unique clients per user
ClientSchema.index({ email: 1, userId: 1 }, { unique: true });

const Client =
  mongoose.models.Client || mongoose.model("Client", ClientSchema);

export default Client;
