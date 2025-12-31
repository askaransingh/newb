
// import express from "express";
// import { getTractorCategoryModel } from "../tractor-model/Category.js";
// // import { getTractorCategoryModel } from "../models/Category.js";

// const router = express.Router();

// // GET all categories
// router.get("/", async (req, res) => {
//   try {
//     const Category = await getTractorCategoryModel();
//     const cats = await Category.find().sort({ name: 1 });
//     res.json(cats);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // PUT update category
// router.put("/:id", async (req, res) => {
//   try {
//     const Category = await getTractorCategoryModel();
//     const { name, description } = req.body;
//     const slug = name ? name.toLowerCase().replace(/\s+/g, "-") : undefined;
//     const cat = await Category.findByIdAndUpdate(
//       req.params.id,
//       { ...(name ? { name, slug } : {}), description },
//       { new: true }
//     );
//     if (!cat) return res.status(404).json({ error: "Category not found" });
//     res.json(cat);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE category
// router.delete("/:id", async (req, res) => {
//   try {
//     const Category = await getTractorCategoryModel();
//     const cat = await Category.findByIdAndDelete(req.params.id);
//     if (!cat) return res.status(404).json({ error: "Category not found" });
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;


import express from "express";
import { registerTractorCategoryModel } from "../tractor-model/Category.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const Category = await registerTractorCategoryModel();
    const cats = await Category.find().sort({ name: 1 });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const Category = await registerTractorCategoryModel();
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

router.delete("/:id", async (req, res) => {
  try {
    const Category = await registerTractorCategoryModel();
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ error: "Category not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;