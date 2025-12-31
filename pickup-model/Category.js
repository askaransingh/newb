import mongoose from "mongoose";
import { connectToPickupDB } from "../database.js";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const getPickupCategoryModel = async () => {
  const conn = await connectToPickupDB();
  return conn.model("Category", categorySchema);
};