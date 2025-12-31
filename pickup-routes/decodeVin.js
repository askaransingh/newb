import express from "express";
const router = express.Router();

router.get("/decode-vin/:vin", async (req, res) => {
  const vin = req.params.vin;
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`;

  const r = await fetch(url);
  const d = await r.json();

  const result = {};
  d.Results.forEach(i => {
    if (["Make", "Model", "Model Year"].includes(i.Variable))
      result[i.Variable] = i.Value;
  });

  res.json({
    year: result["Model Year"],
    make: result.Make,
    model: result.Model
  });
});


export default router;