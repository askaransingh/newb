
// // // import mongoose from "mongoose";
// // // import { connectToTractorDB } from "../database.js";

// // // // Define schema
// // // const categorySchema = new mongoose.Schema({
// // //   name: { type: String, required: true, unique: true },
// // //   slug: { type: String, required: true, unique: true },
// // //   description: { type: String },
// // //   createdAt: { type: Date, default: Date.now },
// // // });

// // // // ✅ Function to get Category model connected to Tractor DB
// // // export const getTractorCategoryModel = async () => {
// // //   const conn = await connectToTractorDB();
// // //   return conn.model("Category", categorySchema);
// // // };

// // import mongoose from "mongoose";
// // import { connectToTractorDB } from "../database.js";

// // const categorySchema = new mongoose.Schema({
// //   name: { type: String, required: true, unique: true },
// //   slug: { type: String, required: true, unique: true },
// //   description: String,
// //   createdAt: { type: Date, default: Date.now },
// // });

// // export const getTractorCategoryModel = async () => {
// //   const conn = await connectToTractorDB();

// //   // ✅ REUSE model if already registered
// //   return conn.models.Category || conn.model("Category", categorySchema);
// // };

// import mongoose from "mongoose";
// import { connectToTractorDB } from "../database.js";

// const categorySchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   slug: { type: String, required: true, unique: true },
//   description: String,
//   createdAt: { type: Date, default: Date.now },
// });

// export const getTractorCategoryModel = async () => {
//   const conn = await connectToTractorDB();

//   // ✅ REUSE model if already registered
//   return conn.models.Category || conn.model("Category", categorySchema);
// };


import mongoose from "mongoose";
import { connectToTractorDB } from "../database.js";

export const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export const registerTractorCategoryModel = async () => {
  const conn = await connectToTractorDB();

  if (!conn.models.Category) {
    conn.model("Category", categorySchema);
  }

  return conn.models.Category;
};


