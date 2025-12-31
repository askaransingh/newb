
// routes/driverRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";
import Driver from "../models/Driver.js";
import Order from "../models/Order.js";
import { sendEmail } from "../utils/sendEmail.js";
import "dotenv/config";
const router = express.Router();
const __dirname = path.resolve();

// 🔐 JWT secret
const JWT_SECRET = "supersecretkey123";

// 📁 Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 📦 Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, Date.now() + "-" + safeName);
  },
});

const upload = multer({ storage });

/* ===================== REGISTER DRIVER ===================== */
router.post(
  "/register",
  upload.fields([
    { name: "drivingLicense", maxCount: 1 },
    { name: "abstractPaper", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;

      const exists = await Driver.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Driver already exists" });
      }

      const hash = await bcrypt.hash(password, 10);

      await Driver.create({
        name,
        email,
        phone,
        password: hash,

        drivingLicense: req.files?.drivingLicense?.[0]?.filename,
        abstractPaper: req.files?.abstractPaper?.[0]?.filename,
        insurance: req.files?.insurance?.[0]?.filename,
      });


       await sendEmail(
        "jaskaransingh70262@gmail.com",
        "🚚 New Driver Registration",
        `
    <h3>New Driver Registered</h3>
    <p>Name: ${name}</p>
    <p>Email: ${email}</p>
    <p>Phone: ${phone}</p>
    <p>Please approve from admin panel.</p>
  `
      );


      res.status(201).json({
        message: "Driver registered, waiting for admin approval",
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* ===================== LOGIN DRIVER ===================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const driver = await Driver.findOne({ email });

    if (!driver) return res.status(404).json({ message: "Driver not found" });
    if (!driver.isApproved)
      return res.status(403).json({ message: "Driver not approved by admin" });

    const valid = await bcrypt.compare(password, driver.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: driver._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, driver });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===================== ADMIN ===================== */

// ADMIN - get all drivers
router.get("/", async (req, res) => {
  const drivers = await Driver.find().sort({ createdAt: -1 });
  res.json(drivers);
});


router.put("/:id/approve", async (req, res) => {
  const driver = await Driver.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );

  await sendEmail(
    driver.email,
    "✅ Driver Approved",
    `
      <h3>Congratulations ${driver.name}</h3>
      <p>Your driver account has been approved.</p>
      <p>You can now login and receive orders.</p>
    `
  );

  res.json(driver);
});

// ❌ Delete driver (ADMIN)
router.delete("/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // 🧹 Delete uploaded files
    const files = [
      driver.drivingLicense,
      driver.abstractPaper,
      driver.insurance,
    ];

    files.forEach((file) => {
      if (file) {
        const filePath = path.join(__dirname, "uploads", file);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    await Driver.findByIdAndDelete(req.params.id);

    res.json({ message: "Driver deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/orders/:driverId", async (req, res) => {
  const orders = await Order.find({
    assignedDriver: req.params.driverId,
  })
    .populate("assignedDriver")
    .select(`
      userName
      email
      phone
      total
      status
      items
      userAddress
      shippingAddress
      billingAddress
      companyAddress
      createdAt
    `);

  res.json(orders);
});

router.put("/assign/:orderId", async (req, res) => {
  try {
    const { driverId } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        assignedDriver: driverId,
        status: "In Transit",
      },
      { new: true }
    ).populate("assignedDriver");

    // ✅ Email driver
    await sendEmail(
      order.assignedDriver.email,
      "📦 New Order Assigned",
      `
        <h3>New Delivery Assigned</h3>
        <p><b>Customer:</b> ${order.userName}</p>
        <p><b>Phone:</b> ${order.phone}</p>
        <p><b>Total:</b> ₹${order.total}</p>
        <p>Please login to driver dashboard for full details.</p>
      `
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post(
  "/deliver/:orderId",
  upload.single("proof"),
  async (req, res) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) return res.status(404).json({ error: "Order not found" });

    order.deliveryProof = req.file.filename;
    order.status = "Delivered";

    await order.save();

    res.json({ message: "Order marked as Delivered" });
  }
);

router.get("/orders/history/:driverId", async (req, res) => {
  try {
    const { driverId } = req.params;

    // Check if driver exists
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ error: "Driver not found" });

    // Fetch all orders assigned to this driver
    const orders = await Order.find({ assignedDriver: driverId })
      .populate("assignedDriver") // include driver details
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching driver order history:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
