import express from "express";
import { getPickupCategoryModel } from "../pickup-model/Category.js"; // ✅ updated import

const router = express.Router();

// 🧾 GET all categories
router.get("/", async (req, res) => {
  try {
    const Category = await getPickupCategoryModel(); // ✅ pickup DB model
    const cats = await Category.find().sort({ name: 1 });
    res.json(cats);
  } catch (err) {
    console.error("Error fetching pickup categories:", err);
    res.status(500).json({ error: err.message });
  }
});

// ➕ POST create category
router.post("/", async (req, res) => {
  try {
    const Category = await getPickupCategoryModel();
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ error: "Name required" });

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const existing = await Category.findOne({ slug });
    if (existing) return res.status(400).json({ error: "Category already exists" });

    const cat = new Category({ name, slug, description });
    await cat.save();

    res.status(201).json(cat);
  } catch (err) {
    console.error("Error creating pickup category:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✏️ PUT update category
router.put("/:id", async (req, res) => {
  try {
    const Category = await getPickupCategoryModel();
    const { name, description } = req.body;
    const slug = name ? name.toLowerCase().replace(/\s+/g, "-") : undefined;

    const cat = await Category.findByIdAndUpdate(
      req.params.id,
      { ...(name ? { name, slug } : {}), description },
      { new: true }
    );

    if (!cat) return res.status(404).json({ error: "Category not found" });
    res.json(cat);
  } catch (err) {
    console.error("Error updating pickup category:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ DELETE category
router.delete("/:id", async (req, res) => {
  try {
    const Category = await getPickupCategoryModel();
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ error: "Category not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting pickup category:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;