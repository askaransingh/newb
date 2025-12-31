import express from "express";
import { getPickupCategoryModel } from "../pickup-model/Category.js";
import { getPickupPartModel } from "../pickup-model/Part.js";
import multer from "multer";
import path from "path";
const router = express.Router();

// 🧾 GET parts (filter by category slug/id, search, pagination)

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const Part = await getPickupPartModel();
    const Category = await getPickupCategoryModel();

    const { category, year } = req.body;

    const cat = await Category.findById(category);
    if (!cat) return res.status(400).json({ error: "Invalid category" });

    const images = req.files?.map(f => f.filename) || [];

    const part = new Part({
      ...req.body,
      year: Number(year),
      images,
      category: cat._id
    });

    await part.save();
    res.status(201).json(part);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const Part = await getPickupPartModel();
    const { category, search } = req.query;
    const q = {};

    if (category) q.category = category;

    if (search) {
      q.$or = [
        { partName: new RegExp(search, "i") },
        { manufacturer: new RegExp(search, "i") },
        { partType: new RegExp(search, "i") },
        { brand: new RegExp(search, "i") },
        { oemNumber: new RegExp(search, "i") },
        { partNumber: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { make: new RegExp(search, "i") },
        { model: new RegExp(search, "i") },
        { year: search }
      ];
    }

    const parts = await Part.find(q).sort({ createdAt: -1 });
    res.json(parts);
  } catch (err) {
    res.status(500).json([]);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const Part = await getPickupPartModel();
    const part = await Part.findById(req.params.id);

    if (!part) {
      return res.status(404).json({ error: "Part not found" });
    }

    res.json(part);
  } catch (err) {
    console.error("Error fetching single pickup part:", err);
    res.status(500).json({ error: err.message });
  }
});

// ➕ POST create part


// ✏️ PUT update part
router.put("/:id", async (req, res) => {
  try {
    const Part = await getPickupPartModel();
    const updated = await Part.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Part not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating pickup part:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ DELETE part
router.delete("/:id", async (req, res) => {
  try {
    const Part = await getPickupPartModel();
    const deleted = await Part.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Part not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting pickup part:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;

