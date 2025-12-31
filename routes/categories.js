// routes/categories.js
import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const cats = await Category.find().sort({ name: 1 });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create category
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const cat = new Category({ name, slug, description });
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update category
router.put("/:id", async (req, res) => {
  try {
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
    res.status(500).json({ error: err.message });
  }
});

// DELETE category (and optionally parts)
router.delete("/:id", async (req, res) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ error: "Category not found" });
    // optional: delete parts in this category (uncomment if desired)
    // await Part.deleteMany({ category: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;