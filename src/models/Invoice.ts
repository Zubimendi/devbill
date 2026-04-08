import mongoose from "mongoose";

const InvoiceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
});

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [InvoiceItemSchema],
      required: true,
      validate: {
        validator: (v: unknown[]) => v.length > 0,
        message: "At least one item is required",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue"],
      default: "draft",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "USD",
    },
    secureToken: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Auto-generate invoice number and secure token
InvoiceSchema.pre("validate", async function (this: any) {
  if (this.isNew) {
    // Generate Invoice Number
    if (!this.invoiceNumber) {
      const count = await mongoose.models.Invoice.countDocuments({
        userId: this.userId,
      });
      this.invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`;
    }

    // Generate Secure Token for public access
    if (!this.secureToken) {
      this.secureToken =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    }
  }
});

InvoiceSchema.index({ userId: 1, status: 1 });
InvoiceSchema.index({ userId: 1, createdAt: -1 });

const Invoice =
  mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);

export default Invoice;
