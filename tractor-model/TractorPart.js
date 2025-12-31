// backend/models/TractorPart.js
import mongoose from "mongoose";
import { connectToTractorDB } from "../database.js";

const partSchema = new mongoose.Schema({
  partName: String,
  category: String,
  subCategory: String,
  brand: String,
  oemNumber: String,
  partNumber: String,
  compatibleVehicles: Array,
  price: Number,
  description: String,
  images: [String],
});

// Create model from tractor DB connection
let TractorPartModel;
(async () => {
  const conn = await connectToTractorDB();
  TractorPartModel = conn.model("TractorPart", partSchema);
})();

export default () => TractorPartModel;