import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  customerEmail: String,
  amount: Number,
  description: String,

  status: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending"
  },

  invoiceId: String, // Stripe / external
  // isMechanicPaid: {
  //   type: Boolean,
  //   default: false
  // },
   // ✅ MECHANIC PAYMENT TRACKING
  isMechanicPaid: {
    type: Boolean,
    default: false
  },
  mechanicPaidAt: {
    type: Date
  }

}, { timestamps: true });

export const Invoice = mongoose.model("Invoice", invoiceSchema);