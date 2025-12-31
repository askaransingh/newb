

// server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import fs from 'fs';
import { connectToDB, connectToPickupDB, connectToTractorDB, connectToUserDB } from "./database.js";
// import { connectToDB, connectToTractor} from "./database.js";
// import { connectToDB, tractorConnection } from "./database.js";

const partsData = JSON.parse(fs.readFileSync('./mockParts50.json', 'utf-8'));
import ordersRoutes from "./routes/orders.js";
import Order from "./models/Order.js";
import categoriesRoutes from "./routes/categories.js";
import partsRoutes from "./routes/parts.js";
import getTractorCategoryroute from "./tractor-routes/categories.js";
import getTractorPartroute from "./tractor-routes/Part.js";
import pickupCategoryRoutes from "./pickup-routes/categories.js";
import pickupPartRoutes from "./pickup-routes/parts.js";
import userRoutes from "./routes/userRoutes.js";
import userSchema from "./models-users/User.js";
// import express from "express";
import nodemailer from "nodemailer";
import driverRoutes from "./routes/driverRoutes.js";
// import driverRoutes from "./routes/driverRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
// import express from "express";
import session from "express-session";
import mongoose from "mongoose";
// import dotenv from "dotenv";
import mechanicRoutes from "./routes/mechanic.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import adminDriverPaymentRoutes from "./routes/adminDriverPayment.js";
import decodevin from "./pickup-routes/decodeVin.js";
// import cors from "cors";

// import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 6003;

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://www.fairdealtruckparts.ca",
    "https://fairdealtruckparts.ca",
    process.env.FRONTEND_URL
  ],
  credentials: true
}));

app.use(cors({
  origin: "*"
}));


app.use(express.json());

connectToDB();

app.use(express.json());

const conn = mongoose.createConnection(process.env.MONGO_URI);

conn.on("connected", () => {
  console.log("DB connected");
});

conn.on("error", (err) => {
  console.error("DB connection error:", err);
});

const tractorConnection = await connectToTractorDB();
const PickupConnection = await connectToPickupDB();
const users = await connectToUserDB();


app.use("/uploads", express.static("uploads"));
// Static for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Get all parts (or filtered by query)
app.get("/parts", (req, res) => {
  const { search } = req.query;
  if (!search) return res.json(partsData);

  const lowerQuery = search.toLowerCase();
  const filtered = partsData.filter(part => {
    // Top-level fields
    const topLevelMatch = Object.keys(part).some(key => {
      if (typeof part[key] === "string" || typeof part[key] === "number") {
        return String(part[key]).toLowerCase().includes(lowerQuery);
      }
      return false;
    });

    // Nested attributes
    const attributesMatch = part.attributes
      ? Object.keys(part.attributes).some(attrKey => {
        const value = part.attributes[attrKey];
        return value && String(value).toLowerCase().includes(lowerQuery);
      })
      : false;

    return topLevelMatch || attributesMatch;
  });

  res.json(filtered);
});

app.get("/decode-vin/:vin", async (req, res) => {
  const vin = req.params.vin;

  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
    const result = await response.json();

    const data = result.Results.reduce((acc, item) => {
      if ([
        "Make", "Model", "Model Year", "Vehicle Type", "Body Class",
        "Gross Vehicle Weight Rating From", "Gross Vehicle Weight Rating To",
        "Engine Number of Cylinders", "Displacement (L)", "Fuel Type - Primary",
        "Manufacturer Name", "Plant City", "Plant State", "Plant Country"
      ].includes(item.Variable)) {
        acc[item.Variable] = item.Value || "N/A";
      }
      return acc;
    }, { vin, heavyDuty: true });

    // ✅ Filter relevant parts by Make, Model, or Model Year
    const relevantParts = partsData.filter(part => {
      const { attributes = {} } = part;
      const matchesMake =
        attributes.make?.toLowerCase() === data.Make?.toLowerCase();
      const matchesModel =
        attributes.model?.toLowerCase() === data.Model?.toLowerCase();
      const matchesYear =
        attributes.year?.toString() === data["Model Year"]?.toString();
      return matchesMake || matchesModel || matchesYear;
    });

    res.json({
      vinData: data,
      relevantParts,
      totalMatches: relevantParts.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to decode VIN or fetch relevant parts",
      details: error.message
    });
  }
});

const router = express.Router();


app.use("/", router);

app.use("/api/categories", categoriesRoutes);
app.use("/api/parts", partsRoutes);

app.use("/api/tractor-categories", getTractorCategoryroute);
app.use("/api/tractor-parts", getTractorPartroute);


// app.use("/uploads", express.static("uploads"));
// app.use("/api/pickup/categories", pickupCategoryRoutes);
// app.use("/api/pickup/parts", pickupPartRoutes);
// app.use("/api", decodevin);
app.use("/uploads", express.static("uploads"));
app.use("/api/pickup/categories", pickupCategoryRoutes);
app.use("/api/pickup/parts", pickupPartRoutes);
app.use("/api", decodevin);
app.use(cors());

app.use("/api/users", userRoutes);

app.use("/api/drivers", driverRoutes);
app.use("/drivers", adminDriverPaymentRoutes);
app.use("/uploads", express.static("uploads"));
let UserModel;

// ✅ Initialize user model
const initUserModel = async () => {
  if (!UserModel) {
    const conn = await connectToUserDB();
    UserModel = conn.model("User", userSchema);
    console.log("✅ User model initialized");
  }
};

initUserModel();


// ✅ Setup Nodemailer transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jaskaransingh70262@gmail.com", // ✅ full Gmail address
    pass: "wkzt xqlh pzcn zuuo",          // ✅ your Gmail App Password
  },
});

async function sendEmailNotification(order) {
  const deliveryDate = order.estimatedDelivery
    ? order.estimatedDelivery.toDateString()
    : "Not Assigned Yet";

  const mailOptions = {
    from: `"FairDeal TruckParts" <jaskaransingh70262@gmail.com>`,
    to: "admin@fairdealtruckdeal.com",
    subject: `🚛 New Order from ${order.userName}`,
    text: `
New order received from ${order.userName} (${order.email})
----------------------------------------------------------
User Address: ${JSON.stringify(order.userAddress, null, 2)}
Company Address: ${JSON.stringify(order.companyAddress, null, 2)}
Total Amount: ₹${order.total}
Status: ${order.status}
Estimated Delivery: ${deliveryDate}

Order Details:
${order.items
        .map(
          (i) =>
            `• ${i.partName} x${i.quantity} = ₹${i.price * i.quantity}`
        )
        .join("\n")}

Please check the admin dashboard for more info.
    `,
  };

  await transporter.sendMail(mailOptions);
}


// ✅ Place New Order
router.post("/api/orders", async (req, res) => {
  try {
    await initUserModel();
    const { email, items } = req.body;

    if (!email || !items || items.length === 0)
      return res.status(400).json({ message: "Invalid order" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    const newOrder = new Order({
      email,
      userName: user.name,
      phone: user.phone,
      userAddress: user.address,
      companyAddress: user.companyAddress,
      billingAddress: user.billingAddress,
      shippingAddress: user.shippingAddress,
      items,
      total,
      status: "Pending",
      estimatedDelivery,
    });

    await newOrder.save();

    // ✅ Send Email Notification to Admin
    await sendEmailNotification(newOrder);

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
});

// ✅ Get All Orders (Admin)
router.get("/api/orders", async (req, res) => {
  try {
    const { email } = req.query;
    const query = email ? { email } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ✅ Update Order Status
router.put("/api/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (err) {
    console.error("❌ Error updating order:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

export default router;


app.use("/mechanic", mechanicRoutes);
app.use("/admin", adminRoutes);
app.use("/customer", customerRoutes);
app.use("/customer", customerRoutes);
app.use("/uploads", express.static("uploads"));


// 🔓 Make uploads publicly accessible
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
