
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 👤 Customer Info
    email: { type: String, required: true },
    userName: String,
    phone: String,

    // 👤 User Address
    userAddress: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: String,
    },

    // 🏢 Company Address
    companyAddress: {
      companyName: String,
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: String,
    },

    // 💳 Billing Address
    billingAddress: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: String,
    },

    // 🚚 Shipping Address
    shippingAddress: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: String,
    },

    // 📦 Order Items
    items: [
      {
        partId: String,
        partName: String,
        quantity: Number,
        price: Number,
      },
    ],

    // 💰 Total Amount
    total: Number,

    // 🔄 Order Status Flow
    status: {
      type: String,
      enum: ["Pending", "In Transit", "Delivered", "Driver Paid"],
      default: "Pending",
    },

    // 🚚 Assigned Driver
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    // 📸 Proof of Delivery
    deliveryProof: String,

    // 💸 Driver Payment Tracking
    isDriverPaid: {
      type: Boolean,
      default: false,
    },
    driverPaidAmount: Number,
    driverPaidAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);