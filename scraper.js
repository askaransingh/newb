// /**
//  * LEGAL + WORKING SCRAPER
//  * Source: Wikipedia (Public, CC BY-SA)
//  * Purpose: Seed heavy-duty truck parts database
//  */

// const express = require("express");
// const mongoose = require("mongoose");
// const axios = require("axios");
// const cheerio = require("cheerio");

// const app = express();

// /* =========================
//    MongoDB Connection
// ========================= */
// mongoose.connect(
//   "mongodb+srv://jaskaransingh70262_db_user:Og19Nco59E4pKmfN@cluster0.ylmfidw.mongodb.net/truck_parts"
// ).then(() => console.log("MongoDB connected"))
//  .catch(err => console.error(err));

// /* =========================
//    Schema
// ========================= */
// const partSchema = new mongoose.Schema({
//   partName: String,
//   manufacturer: String,
//   brand: String,
//   partType: String,
//   oemNumber: String,
//   partNumber: String,
//   msrp: Number,
//   currency: String,
//   imageUrls: [String],
//   description: String,
//   sourceUrl: String
// }, { timestamps: true });

// const Part = mongoose.model("Part", partSchema);

// /* =========================
//    CONFIG
// ========================= */
// const MAX_PARTS = 1000;

// /**
//  * SAFE PUBLIC SOURCES
//  */
// const SOURCE_PAGES = [
//   { url: "https://en.wikipedia.org/wiki/Diesel_engine", category: "Engine" },
//   { url: "https://en.wikipedia.org/wiki/Air_brake", category: "Brake System" },
//   { url: "https://en.wikipedia.org/wiki/Vehicle_suspension", category: "Suspension" },
//   { url: "https://en.wikipedia.org/wiki/Transmission_(mechanical)", category: "Transmission" },
//   { url: "https://en.wikipedia.org/wiki/Exhaust_system", category: "Exhaust" },
//   { url: "https://en.wikipedia.org/wiki/Fuel_filter", category: "Fuel System" }
// ];

// /* =========================
//    SCRAPER
// ========================= */
// async function scrapeWikipedia(page) {
//   const res = await axios.get(page.url, {
//     headers: { "User-Agent": "Mozilla/5.0" }
//   });

//   const $ = cheerio.load(res.data);
//   const items = [];

//   $("p").each((_, el) => {
//     const text = $(el).text().trim();
//     if (text.length < 80) return;
//     if (items.length >= 200) return;

//     const name = text.split(".")[0].slice(0, 60);

//     items.push({
//       partName: name,
//       manufacturer: "Generic",
//       brand: "Aftermarket",
//       partType: page.category,
//       oemNumber: "",
//       partNumber: "",
//       msrp: 0,
//       currency: "CAD",
//       imageUrls: [],
//       description: text,
//       sourceUrl: page.url
//     });
//   });

//   return items;
// }

// /* =========================
//    CONTROLLER
// ========================= */
// app.get("/scrape", async (req, res) => {
//   let inserted = 0;

//   for (const page of SOURCE_PAGES) {
//     if (inserted >= MAX_PARTS) break;

//     try {
//       const parts = await scrapeWikipedia(page);

//       for (const part of parts) {
//         if (inserted >= MAX_PARTS) break;

//         await Part.create(part);
//         inserted++;
//       }

//     } catch (err) {
//       console.error("Scrape error:", page.url, err.message);
//     }
//   }

//   res.json({
//     success: true,
//     totalInserted: inserted,
//     message: "Wikipedia parts data seeded successfully"
//   });
// });

// /* =========================
//    SERVER
// ========================= */
// app.listen(3000, () => {
//   console.log("Server running → http://localhost:3000/scrape");
// });



/**
 * HEAVY DUTY TRUCK PARTS – REALISTIC DATA GENERATOR
 * Single File | Node.js + Express + MongoDB
 * Market: Canada
 */

const express = require("express");
const mongoose = require("mongoose");

const app = express();

/* =========================
   MongoDB Connection
========================= */
mongoose.connect(
  "mongodb+srv://jaskaransingh70262_db_user:Og19Nco59E4pKmfN@cluster0.ylmfidw.mongodb.net/truck_parts"
).then(() => console.log("MongoDB connected"))
 .catch(err => console.error(err));

/* =========================
   Schema
========================= */
const partSchema = new mongoose.Schema({
  partName: String,
  manufacturer: String,
  brand: String,
  partType: String,
  oemNumber: String,
  partNumber: String,
  msrp: Number,
  currency: String,
  imageUrls: [String],
  description: String,
  sourceUrl: String
}, { timestamps: true });

const Part = mongoose.model("Part", partSchema);

/* =========================
   DATA DEFINITIONS
========================= */

const BRANDS = ["Aftermarket Pro", "TruckMax", "HeavyDuty Plus", "RoadKing", "FleetLine"];
const MANUFACTURERS = ["Generic Truck Parts Inc.", "North America Aftermarket", "Fleet Components Ltd."];

const PART_CATEGORIES = {
  "Brake System": [
    "Air Brake Chamber",
    "Brake Drum",
    "Brake Shoe",
    "Slack Adjuster",
    "ABS Sensor",
    "Brake Hose",
    "Brake Valve",
    "Air Dryer Cartridge"
  ],
  "Suspension": [
    "Leaf Spring",
    "Shock Absorber",
    "Air Suspension Bag",
    "Torque Rod",
    "Spring Pin",
    "Suspension Bushing"
  ],
  "Steering": [
    "Steering Gear Box",
    "Tie Rod End",
    "Drag Link",
    "Steering Column Shaft",
    "Power Steering Hose"
  ],
  "Drivetrain": [
    "Drive Shaft",
    "Universal Joint",
    "Differential Housing",
    "Axle Shaft",
    "Wheel Hub Assembly"
  ],
  "Electrical": [
    "Starter Motor",
    "Alternator",
    "Wiring Harness",
    "Relay Switch",
    "Voltage Regulator"
  ],
  "Lighting": [
    "LED Headlamp",
    "Tail Light Assembly",
    "Marker Light",
    "Fog Light",
    "Reflector Lamp"
  ],
  "Body & Exterior": [
    "Front Bumper",
    "Side Mirror Assembly",
    "Mud Flap",
    "Grille Panel",
    "Fender Panel"
  ],
  "Interior & Cabin": [
    "Driver Seat",
    "Seat Belt Assembly",
    "Dashboard Panel",
    "Cabin Air Filter",
    "Floor Mat"
  ],
  "Cooling System": [
    "Radiator",
    "Coolant Reservoir",
    "Cooling Fan",
    "Fan Clutch",
    "Radiator Hose"
  ],
  "Fuel System": [
    "Fuel Tank",
    "Fuel Pump",
    "Fuel Filter",
    "Fuel Line Hose",
    "Fuel Cap"
  ],
  "Exhaust System": [
    "Exhaust Muffler",
    "Exhaust Pipe",
    "DEF Tank",
    "Exhaust Clamp",
    "Heat Shield"
  ],
  "Wheels & Tires": [
    "Steel Wheel Rim",
    "Wheel Nut",
    "Wheel Stud",
    "Hub Cap",
    "Valve Stem"
  ],
  "Safety & Accessories": [
    "Fire Extinguisher",
    "Warning Triangle",
    "Backup Alarm",
    "Side Guard",
    "Camera Sensor"
  ]
};

/* =========================
   UTILITIES
========================= */

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePartNumber(cat) {
  return `${cat.slice(0,3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

/* =========================
   SEED FUNCTION
========================= */
async function generateParts(limit = 1000) {
  let count = 0;

  for (const category in PART_CATEGORIES) {
    for (const baseName of PART_CATEGORIES[category]) {
      for (let i = 0; i < 20; i++) {
        if (count >= limit) return count;

        await Part.create({
          partName: `${baseName} – Heavy Duty`,
          manufacturer: randomItem(MANUFACTURERS),
          brand: randomItem(BRANDS),
          partType: category,
          oemNumber: `OEM-${Math.floor(10000 + Math.random() * 90000)}`,
          partNumber: generatePartNumber(category),
          msrp: randomPrice(50, 1800),
          currency: "CAD",
          imageUrls: [
            "https://via.placeholder.com/600x600.png?text=Truck+Part"
          ],
          description: `${baseName} designed for heavy-duty trucks, suitable for long-haul and commercial fleet operations.`,
          sourceUrl: "Generated Aftermarket Data"
        });

        count++;
      }
    }
  }
  return count;
}

/* =========================
   API
========================= */
app.get("/seed", async (req, res) => {
  const inserted = await generateParts(1000);
  res.json({
    success: true,
    totalInserted: inserted,
    message: "1000 realistic heavy-duty truck parts generated successfully"
  });
});

app.get("/parts", async (req, res) => {
  const parts = await Part.find().limit(1000);
  res.json(parts);
});

/* =========================
   SERVER
========================= */
app.listen(3000, () => {
  console.log("Server running → http://localhost:3000/seed");
});