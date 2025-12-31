
// import mongoose from "mongoose";
// import { connectToPickupDB } from "../database.js";

// const partSchema = new mongoose.Schema({
//   partName: { type: String, required: true },
//   manufacturer: String,
//   partType: String,

//   year: Number,
//   make: String,
//   model: String,

//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//     required: true
//   },

//   brand: String,
//   oemNumber: String,
//   partNumber: String,

//   description: String,
//   price: Number,
//   msrp: Number,
//   currency: { type: String, default: "INR" },
//   stock: Number,

//   images: [String],
//   createdAt: { type: Date, default: Date.now }
// });

// // 🔍 GLOBAL SEARCH INDEX
// partSchema.index({
//   partName: "text",
//   manufacturer: "text",
//   partType: "text",
//   brand: "text",
//   oemNumber: "text",
//   partNumber: "text",
//   description: "text",
//   make: "text",
//   model: "text",
//   year: "text"
// });

// export const getPickupPartModel = async () => {
//   const conn = await connectToPickupDB();
//   return conn.model("Part", partSchema);
// };

import mongoose from "mongoose";
import { connectToPickupDB } from "../database.js";

const partSchema = new mongoose.Schema({
  partName: { type: String, required: true },
  manufacturer: String,
  partType: String,

  year: Number,   // keep as Number for proper filtering
  make: String,
  model: String,

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  brand: String,
  oemNumber: String,
  partNumber: String,

  description: String,
  price: Number,
  msrp: Number,
  currency: { type: String, default: "INR" },
  stock: Number,

  images: [String],
  createdAt: { type: Date, default: Date.now }
});

// 🔍 GLOBAL TEXT SEARCH INDEX (year converted to string for search)
partSchema.index({
  partName: "text",
  manufacturer: "text",
  partType: "text",
  brand: "text",
  oemNumber: "text",
  partNumber: "text",
  description: "text",
  make: "text",
  model: "text",
  year: "text"
});

export const getPickupPartModel = async () => {
  const conn = await connectToPickupDB();
  return conn.model("Part", partSchema);
};