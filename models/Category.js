// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true }, // e.g. "air-spring"
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Category", categorySchema);