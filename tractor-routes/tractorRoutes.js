// // backend/routes/tractorRoutes.js
// import express from "express";
// import getTractorModel from "../models/TractorPart.js";

// const router = express.Router();

// router.get("/tractor-parts", async (req, res) => {
//   try {
//     const TractorPart = getTractorModel();
//     const parts = await TractorPart.find();
//     res.json(parts);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.post("/tractor-parts", async (req, res) => {
//   try {
//     const TractorPart = getTractorModel();
//     const newPart = await TractorPart.create(req.body);
//     res.status(201).json(newPart);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// export default router;