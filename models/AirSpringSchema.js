// // models/AirSpringSchema.js
// const mongoose = require("mongoose");

// const airSpringSchema = new mongoose.Schema({
//   partName: { type: String, required: true },         
//   category: { type: String, default: "Suspension" },  // Common for air springs
//   subCategory: { type: String, default: "Air Spring" },

//   brand: { type: String, required: true },
//   oemNumber: { type: String },
//   partNumber: { type: String, unique: true },

//   compatibleVehicles: [
//     {
//       make: { type: String, required: true },
//       model: { type: String, required: true },
//       year: { type: Number, required: true },
//       engine: { type: String },
//       variant: { type: String },
//     },
//   ],

//   specifications: {
//     material: { type: String },
//     dimensions: { type: String },
//     weight: { type: String },
//     pressureRange: { type: String },      // Air spring-specific
//     loadCapacity: { type: String },       // Air spring-specific
//     mountingType: { type: String },       // e.g. "Top Plate", "Bottom Stud"
//     color: { type: String },
//   },

//   price: { type: Number, required: true },
//   currency: { type: String, default: "INR" },
//   stock: { type: Number, default: 0 },
//   discount: { type: Number, default: 0 },

//   description: { type: String },
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

// // 🔍 Add useful indexes
// airSpringSchema.index({
//   partName: "text",
//   brand: "text",
//   "compatibleVehicles.make": 1,
//   "compatibleVehicles.model": 1,
//   "compatibleVehicles.year": 1,
// });

// module.exports = mongoose.model("AirSpring", airSpringSchema);



// models/AirSpringSchema.js
const mongoose = require("mongoose");

const airSpringSchema = new mongoose.Schema({
  partName: { type: String, required: true },         
  category: { type: String, default: "Suspension" },
  subCategory: { type: String, default: "Air Spring" },

  brand: { type: String, required: true },
  oemNumber: { type: String },
  partNumber: { type: String, unique: true },

  compatibleVehicles: [
    {
      make: { type: String, required: true },
      model: { type: String, required: true },
      year: { type: Number, required: true },
      engine: { type: String },
      variant: { type: String },
    },
  ],

  specifications: {
    material: { type: String },
    dimensions: { type: String },
    weight: { type: String },
    pressureRange: { type: String },
    loadCapacity: { type: String },
    mountingType: { type: String },
    color: { type: String },
  },

  price: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  stock: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },

  description: { type: String },
  images: [String],

  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },

  supplier: {
    name: String,
    contact: String,
    email: String,
  },

  createdAt: { type: Date, default: Date.now },
});

// 🔹 Text index only for fields safe for text search
airSpringSchema.index({
  partName: "text",
  brand: "text",
});

// 🔹 Separate regular indexes for efficient queries on compatibleVehicles array
airSpringSchema.index({ "compatibleVehicles.make": 1 });
airSpringSchema.index({ "compatibleVehicles.model": 1 });
airSpringSchema.index({ "compatibleVehicles.year": 1 });

module.exports = mongoose.model("AirSpring", airSpringSchema);