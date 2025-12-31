
// import mongoose from "mongoose";

// const partSchema = new mongoose.Schema({
//   partName: { type: String, required: true },
//   manufacturer: { type: String }, // NEW
//   partType: { type: String }, // NEW
//   category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
//   subCategory: { type: String },
//   brand: { type: String, required: true },
//   oemNumber: { type: String },
//   partNumber: { type: String, unique: true, sparse: true },
//   description: { type: String },
//   price: { type: Number, required: true },
//   msrp: { type: Number }, // NEW
//   currency: { type: String, default: "INR" },
//   stock: { type: Number, default: 0 },
//   inStock: { type: Boolean, default: true }, // NEW
//   compatibleVehicles: [
//     {
//       make: String,
//       model: String,
//       year: Number,
//       engine: String,
//       variant: String,
//     },
//   ],
//   specifications: {
//     material: String,
//     dimensions: String,
//     weight: String,
//     pressureRange: String,
//     loadCapacity: String,
//     mountingType: String,
//     color: String,
//   },
//   images: [String],
//   rating: { type: Number, default: 0 },
//   reviewsCount: { type: Number, default: 0 },
//   supplier: {
//     name: String,
//     contact: String,
//     email: String,
//   },
//   createdAt: { type: Date, default: Date.now },
// });

// partSchema.index({
//   partName: "text",
//   brand: "text",
//   manufacturer: "text",
//   partNumber: "text",
//   "compatibleVehicles.make": "text",
//   "compatibleVehicles.model": "text",
//   "compatibleVehicles.year": "text"
// });

// export default mongoose.model("Part", partSchema);


import mongoose from "mongoose";

const partSchema = new mongoose.Schema({
  partName: { type: String, required: true },

  // 🔥 NEW CORE SEARCH FIELDS
  year: { type: Number },
  make: { type: String },
  model: { type: String },

  manufacturer: String,
  partType: String,

  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

  brand: { type: String, required: true },
  oemNumber: String,
  partNumber: { type: String, unique: true, sparse: true },

  description: String,

  price: { type: Number, required: true },
  msrp: Number,
  currency: { type: String, default: "INR" },

  stock: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },

  images: [String], // filenames

  createdAt: { type: Date, default: Date.now },
});

// 🔍 FULL TEXT SEARCH — EVERYTHING
partSchema.index({
  partName: "text",
  brand: "text",
  manufacturer: "text",
  partNumber: "text",
  oemNumber: "text",
  make: "text",
  model: "text",
  year: "text",
});

export default mongoose.model("Part", partSchema); 