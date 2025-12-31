// routes/parts.js
import express from "express";
import Part from "../models/Part.js";
import Category from "../models/Category.js";
import fs from "fs";
import multer from "multer";
import path from "path";

const router = express.Router();

/* =========================
   MULTER SETUP (TOP)
========================= */
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage });

/* =========================
   GET PARTS (SEARCH ANY FIELD)
========================= */

router.get("/", async (req, res) => {
  try {
    const { search, category, page = 1, limit = 50 } = req.query;
    let q = {};

    // Category filter
    if (category) {
      q.category = category;
    }

    // Search ANY FIELD
    // if (search) {
    //   const regex = new RegExp(search, "i"); // case-insensitive

    //   q.$or = [
    //     { partName: regex },
    //     { manufacturer: regex },
    //     { partType: regex },
    //     { brand: regex },
    //     { oemNumber: regex },
    //     { partNumber: regex },
    //     { description: regex },
    //     { make: regex },
    //     { model: regex },
    //     { year: regex },

    //     // Numeric fields (convert search to number if possible)
    //     ...(isNaN(search)
    //       ? []
    //       : [
    //         { price: Number(search) },
    //         { msrp: Number(search) },
    //       ]),
    //   ];
    // }

    // Search ANY FIELD (SAFE)
if (search) {
  const regex = new RegExp(search, "i");

  q.$or = [
    { partName: regex },
    { manufacturer: regex },
    { partType: regex },
    { brand: regex },
    { oemNumber: regex },
    { partNumber: regex },
    { description: regex },
    { make: regex },
    { model: regex },
  ];

  // Numeric-only search
  if (!isNaN(search)) {
    q.$or.push(
      { year: Number(search) },
      { price: Number(search) },
      { msrp: Number(search) }
    );
  }
}

    const parts = await Part.find(q)
      .populate("category", "name slug")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json(parts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* =========================
   GET SINGLE PART
========================= */
router.get("/:id", async (req, res) => {
  try {
    const part = await Part.findById(req.params.id)
      .populate("category", "name slug");

    if (!part) return res.status(404).json({ error: "Part not found" });
    res.json(part);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CREATE PART (WITH IMAGES)
========================= */
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const cat = await Category.findById(req.body.category);
    if (!cat) return res.status(400).json({ error: "Invalid category" });

    const images = req.files?.map(f => f.filename) || [];

    const part = new Part({
      ...req.body,
      images,
      category: cat._id,
    });

    await part.save();
    res.status(201).json(part);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   UPDATE PART
========================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Part.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Part not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DELETE PART
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const p = await Part.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ error: "Part not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;