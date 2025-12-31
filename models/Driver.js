
// models/Driver.js
import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    password: String, // 🔒 hashed ideally

    drivingLicense: String,
    abstractPaper: String,
    insurance: String,


    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);