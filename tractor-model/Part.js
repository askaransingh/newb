// // // // models/Part.js
// // // import { connectToTractorDB } from "../database.js";
// // // import mongoose from "mongoose";

// // // const partSchema = new mongoose.Schema({
// // //   partName: { type: String, required: true },
// // //   manufacturer: { type: String },
// // //   partType: { type: String },
// // //   category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
// // //   subCategory: { type: String },
// // //   brand: { type: String, required: true },
// // //   oemNumber: { type: String },
// // //   partNumber: { type: String, unique: true, sparse: true },
// // //   description: { type: String },
// // //   price: { type: Number, required: true },
// // //   msrp: { type: Number },
// // //   currency: { type: String, default: "INR" },
// // //   stock: { type: Number, default: 0 },
// // //   inStock: { type: Boolean, default: true },
// // //   compatibleVehicles: [
// // //     {
// // //       make: String,
// // //       model: String,
// // //       year: Number,
// // //       engine: String,
// // //       variant: String,
// // //     },
// // //   ],
// // //   specifications: {
// // //     material: String,
// // //     dimensions: String,
// // //     weight: String,
// // //     pressureRange: String,
// // //     loadCapacity: String,
// // //     mountingType: String,
// // //     color: String,
// // //   },
// // //   images: [String],
// // //   rating: { type: Number, default: 0 },
// // //   reviewsCount: { type: Number, default: 0 },
// // //   supplier: {
// // //     name: String,
// // //     contact: String,
// // //     email: String,
// // //   },
// // //   createdAt: { type: Date, default: Date.now },
// // // });

// // // // Create text index for search
// // // partSchema.index({
// // //   partName: "text",
// // //   brand: "text",
// // //   manufacturer: "text",
// // //   partNumber: "text",
// // //   "compatibleVehicles.make": "text",
// // //   "compatibleVehicles.model": "text",
// // //   "compatibleVehicles.year": "text",
// // // });

// // // // ✅ Export a function that returns the Part model from Tractor connection
// // // export const getTractorPartModel = async () => {
// // //   const conn = await connectToTractorDB();
// // //   return conn.model("Part", partSchema);
// // // };

// // // tractor-model/Part.js
// // import { connectToTractorDB } from "../database.js";
// // import mongoose from "mongoose";

// // const partSchema = new mongoose.Schema({
// //   partName: { type: String, required: true },

// //   // ✅ SAME AS TRUCKS
// //   year: { type: String },          // e.g. "2021"
// //   make: { type: String },          // e.g. "Mahindra"
// //   model: { type: String },         // e.g. "275 DI"

// //   manufacturer: { type: String },
// //   partType: { type: String },

// //   category: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "Category",
// //     required: true,
// //   },

// //   brand: { type: String, required: true },
// //   oemNumber: { type: String },
// //   partNumber: { type: String },

// //   price: { type: Number, required: true },
// //   msrp: { type: Number },
// //   currency: { type: String, default: "INR" },
// //   stock: { type: Number, default: 0 },

// //   description: { type: String },

// //   images: [{ type: String }],

// //   createdAt: { type: Date, default: Date.now },
// // });

// // /* 🔍 Text Search Index (IMPORTANT) */
// // partSchema.index({
// //   partName: "text",
// //   brand: "text",
// //   manufacturer: "text",
// //   partNumber: "text",
// //   make: "text",
// //   model: "text",
// //   year: "text",
// // });

// // // ✅ Return model from Tractor DB connection
// // export const getTractorPartModel = async () => {
// //   const conn = await connectToTractorDB();
// //   return conn.model("Part", partSchema);
// // };

// import mongoose from "mongoose";
// import { connectToTractorDB } from "../database.js";

// const partSchema = new mongoose.Schema({
//   partName: { type: String, required: true },

//   year: String,
//   make: String,
//   model: String,

//   manufacturer: String,
//   partType: String,

//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category", // MUST match model name
//     required: true,
//   },

//   brand: { type: String, required: true },
//   oemNumber: String,
//   partNumber: String,

//   price: { type: Number, required: true },
//   msrp: Number,
//   currency: { type: String, default: "INR" },
//   stock: { type: Number, default: 0 },

//   description: String,
//   images: [String],

//   createdAt: { type: Date, default: Date.now },
// });

// // (Optional index – OK to keep)
// partSchema.index({
//   partName: "text",
//   brand: "text",
//   partNumber: "text",
// });

// export const getTractorPartModel = async () => {
//   const conn = await connectToTractorDB();

//   // ✅ REUSE model
//   return conn.models.Part || conn.model("Part", partSchema);
// };

import mongoose from "mongoose";
import { connectToTractorDB } from "../database.js";
import { registerTractorCategoryModel } from "./Category.js";

const partSchema = new mongoose.Schema({
  partName: { type: String, required: true },

  year: String,
  make: String,
  model: String,

  manufacturer: String,
  partType: String,

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  brand: { type: String, required: true },
  oemNumber: String,
  partNumber: String,

  price: { type: Number, required: true },
  msrp: Number,
  currency: { type: String, default: "INR" },
  stock: { type: Number, default: 0 },

  description: String,
  images: [String],

  createdAt: { type: Date, default: Date.now },
});

partSchema.index({
  partName: "text",
  brand: "text",
  partNumber: "text",
});

export const getTractorPartModel = async () => {
  const conn = await connectToTractorDB();

  // 🔥 FORCE category registration FIRST
  await registerTractorCategoryModel();

  if (!conn.models.Part) {
    conn.model("Part", partSchema);
  }

  return conn.models.Part;
};