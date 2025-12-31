// // import express from "express";
// // // import { getTractorPartModel } from "../models/Part.js";
// // // import { getTractorCategoryModel } from "../models/Category.js";
// // import { getTractorCategoryModel } from "../tractor-model/Category.js";
// // import { getTractorPartModel } from "../tractor-model/Part.js";
// // const router = express.Router();

// // // GET parts (filter by category slug/id, search, pagination)
// // router.get("/", async (req, res) => {
// //   try {
// //     const Part = await getTractorPartModel();
// //     const Category = await getTractorCategoryModel();

// //     const { category, search, page = 1, limit = 50 } = req.query;
// //     const q = {};

// //     if (category) {
// //       let cat = null;
// //       if (category.match(/^[0-9a-fA-F]{24}$/)) cat = await Category.findById(category);
// //       else cat = await Category.findOne({ slug: category });
// //       if (cat) q.category = cat._id;
// //       else return res.json([]); // unknown category -> empty
// //     }

// //     if (search) q.$text = { $search: search };

// //     const parts = await Part.find(q)
// //       .populate("category", "name slug")
// //       .skip((page - 1) * limit)
// //       .limit(Number(limit))
// //       .sort({ createdAt: -1 });

// //     res.json(parts);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // GET single part
// // router.get("/:id", async (req, res) => {
// //   try {
// //     const Part = await getTractorPartModel();
// //     const part = await Part.findById(req.params.id).populate("category", "name slug");
// //     if (!part) return res.status(404).json({ error: "Part not found" });
// //     res.json(part);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });


// // router.put("/:id", upload.array("images", 5), async (req, res) => {
// //   try {
// //     const Part = await getTractorPartModel();
// //     const Category = await getTractorCategoryModel();

// //     const update = {
// //       partName: req.body.partName,
// //       manufacturer: req.body.manufacturer,
// //       partType: req.body.partType,
// //       brand: req.body.brand,
// //       oemNumber: req.body.oemNumber,
// //       partNumber: req.body.partNumber,
// //       price: Number(req.body.price),
// //       msrp: Number(req.body.msrp),
// //       currency: req.body.currency || "INR",
// //       stock: Number(req.body.stock),
// //       year: req.body.year,
// //       make: req.body.make,
// //       model: req.body.model,
// //       description: req.body.description,
// //     };

// //     // ✅ Update category if provided
// //     if (req.body.category) {
// //       const cat = await Category.findById(req.body.category);
// //       if (!cat) return res.status(400).json({ error: "Invalid category" });
// //       update.category = cat._id;
// //     }

// //     // ✅ Update images if uploaded
// //     if (req.files && req.files.length) {
// //       update.images = req.files.map(f => f.filename);
// //     }

// //     const updated = await Part.findByIdAndUpdate(req.params.id, update, {
// //       new: true,
// //     });

// //     if (!updated) return res.status(404).json({ error: "Part not found" });

// //     res.json(updated);
// //   } catch (err) {
// //     console.error("TRACTOR PART UPDATE ERROR:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // DELETE part
// // router.delete("/:id", async (req, res) => {
// //   try {
// //     const Part = await getTractorPartModel();
// //     const p = await Part.findByIdAndDelete(req.params.id);
// //     if (!p) return res.status(404).json({ error: "Part not found" });
// //     res.json({ success: true });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });



// // import { upload } from "../middleware/upload.js";

// // router.post("/", upload.array("images", 5), async (req, res) => {
// //   try {
// //     const Part = await getTractorPartModel();
// //     const Category = await getTractorCategoryModel();

// //     const { category } = req.body;

// //     if (!category) {
// //       return res.status(400).json({ error: "Category is required" });
// //     }

// //     const cat = await Category.findById(category);
// //     if (!cat) {
// //       return res.status(400).json({ error: "Invalid category" });
// //     }

// //     const images = req.files ? req.files.map(f => f.filename) : [];

// //     const part = new Part({
// //       partName: req.body.partName,
// //       manufacturer: req.body.manufacturer,
// //       partType: req.body.partType,
// //       brand: req.body.brand,
// //       oemNumber: req.body.oemNumber,
// //       partNumber: req.body.partNumber,
// //       price: req.body.price,
// //       msrp: req.body.msrp,
// //       currency: req.body.currency || "INR",
// //       stock: req.body.stock,
// //       year: req.body.year,
// //       make: req.body.make,
// //       model: req.body.model,
// //       description: req.body.description,
// //       category: cat._id,
// //       images,
// //     });

// //     await part.save();
// //     res.status(201).json(part);
// //   } catch (err) {
// //     console.error("TRACTOR PART CREATE ERROR:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });
// // export default router;

// import express from "express";
// import mongoose from "mongoose";
// import { upload } from "../middleware/upload.js";
// import { getTractorCategoryModel } from "../tractor-model/Category.js";
// import { getTractorPartModel } from "../tractor-model/Part.js";

// const router = express.Router();

// /* =========================
//    GET PARTS (SAFE)
// ========================= */
// router.get("/", async (req, res) => {
//   try {
//     const Part = await getTractorPartModel();
//     const Category = await getTractorCategoryModel();

//     const { category, search, page = 1, limit = 50 } = req.query;
//     const q = {};

//     /* ✅ CATEGORY FILTER */
//     if (category) {
//       if (!mongoose.Types.ObjectId.isValid(category)) {
//         return res.json([]);
//       }

//       const cat = await Category.findById(category);
//       if (!cat) return res.json([]);

//       q.category = cat._id;
//     }

//     /* ✅ SAFE SEARCH (NO $text) */
//     if (search) {
//       q.$or = [
//         { partName: { $regex: search, $options: "i" } },
//         { brand: { $regex: search, $options: "i" } },
//         { partNumber: { $regex: search, $options: "i" } },
//         { oemNumber: { $regex: search, $options: "i" } },
//       ];
//     }

//     const parts = await Part.find(q)
//       .populate("category", "name slug")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     res.json(parts);
//   } catch (err) {
//     console.error("TRACTOR PART FETCH ERROR:", err);
//     res.status(500).json([]);
//   }
// });

// /* =========================
//    GET SINGLE PART
// ========================= */
// router.get("/:id", async (req, res) => {
//   try {
//     const Part = await getTractorPartModel();

//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(404).json({ error: "Invalid ID" });
//     }

//     const part = await Part.findById(req.params.id).populate("category");
//     if (!part) return res.status(404).json({ error: "Part not found" });

//     res.json(part);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /* =========================
//    CREATE PART
// ========================= */
// router.post("/", upload.array("images", 5), async (req, res) => {
//   try {
//     const Part = await getTractorPartModel();
//     const Category = await getTractorCategoryModel();

//     if (!req.body.category || !mongoose.Types.ObjectId.isValid(req.body.category)) {
//       return res.status(400).json({ error: "Valid category required" });
//     }

//     const cat = await Category.findById(req.body.category);
//     if (!cat) return res.status(400).json({ error: "Category not found" });

//     const images = req.files?.map(f => f.filename) || [];

//     const part = new Part({
//       partName: req.body.partName,
//       manufacturer: req.body.manufacturer,
//       partType: req.body.partType,
//       brand: req.body.brand,
//       oemNumber: req.body.oemNumber,
//       partNumber: req.body.partNumber,
//       price: Number(req.body.price),
//       msrp: Number(req.body.msrp),
//       currency: req.body.currency || "INR",
//       stock: Number(req.body.stock),
//       year: req.body.year,
//       make: req.body.make,
//       model: req.body.model,
//       description: req.body.description,
//       category: cat._id,
//       images,
//     });

//     await part.save();
//     res.status(201).json(part);
//   } catch (err) {
//     console.error("TRACTOR PART CREATE ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// /* =========================
//    UPDATE PART
// ========================= */
// router.put("/:id", upload.array("images", 5), async (req, res) => {
//   try {
//     const Part = await getTractorPartModel();
//     const Category = await getTractorCategoryModel();

//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(404).json({ error: "Invalid ID" });
//     }

//     const update = {
//       partName: req.body.partName,
//       manufacturer: req.body.manufacturer,
//       partType: req.body.partType,
//       brand: req.body.brand,
//       oemNumber: req.body.oemNumber,
//       partNumber: req.body.partNumber,
//       price: Number(req.body.price),
//       msrp: Number(req.body.msrp),
//       currency: req.body.currency,
//       stock: Number(req.body.stock),
//       year: req.body.year,
//       make: req.body.make,
//       model: req.body.model,
//       description: req.body.description,
//     };

//     if (req.body.category && mongoose.Types.ObjectId.isValid(req.body.category)) {
//       const cat = await Category.findById(req.body.category);
//       if (cat) update.category = cat._id;
//     }

//     if (req.files?.length) {
//       update.images = req.files.map(f => f.filename);
//     }

//     const updated = await Part.findByIdAndUpdate(req.params.id, update, { new: true });
//     if (!updated) return res.status(404).json({ error: "Part not found" });

//     res.json(updated);
//   } catch (err) {
//     console.error("TRACTOR PART UPDATE ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// /* =========================
//    DELETE PART
// ========================= */
// router.delete("/:id", async (req, res) => {
//   try {
//     const Part = await getTractorPartModel();

//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(404).json({ error: "Invalid ID" });
//     }

//     const p = await Part.findByIdAndDelete(req.params.id);
//     if (!p) return res.status(404).json({ error: "Part not found" });

//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;


import express from "express";
import mongoose from "mongoose";
import { upload } from "../middleware/upload.js";
import { getTractorPartModel } from "../tractor-model/Part.js";
import { registerTractorCategoryModel } from "../tractor-model/Category.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const Part = await getTractorPartModel();
    const Category = await registerTractorCategoryModel();

    const { category, search, page = 1, limit = 50 } = req.query;
    const q = {};

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      const cat = await Category.findById(category);
      if (!cat) return res.json([]);
      q.category = cat._id;
    }

    if (search) {
      q.$or = [
        { partName: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { partNumber: { $regex: search, $options: "i" } },
        { oemNumber: { $regex: search, $options: "i" } },
      ];
    }

    const parts = await Part.find(q)
      // .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(parts);
  } catch (err) {
    console.error("TRACTOR PART FETCH ERROR:", err);
    res.status(500).json([]);
  }
});

router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const Part = await getTractorPartModel();
    const Category = await registerTractorCategoryModel();

    if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
      return res.status(400).json({ error: "Valid category required" });
    }

    const cat = await Category.findById(req.body.category);
    if (!cat) return res.status(400).json({ error: "Category not found" });

    const images = req.files?.map(f => f.filename) || [];

    const part = new Part({
      ...req.body,
      price: Number(req.body.price),
      msrp: Number(req.body.msrp),
      stock: Number(req.body.stock),
      category: cat._id,
      images,
    });

    await part.save();
    res.status(201).json(part);
  } catch (err) {
    console.error("TRACTOR PART CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;