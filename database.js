

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load env vars first

// 🚚 Default Truck DB
export const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.TRUCK_DB_URI, {
      retryWrites: true,
      w: "majority",
    });
    console.log(`🚚 Truck DB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("Truck DB connection error:", err);
    process.exit(1);
  }
};

// 🚜 Tractor DB (separate)
export const connectToTractorDB = async () => {
  try {
    const conn = await mongoose.createConnection(process.env.TRACTOR_DB_URI, {
      ssl: true,
      tlsAllowInvalidCertificates: false,
      retryWrites: true,
      w: "majority",
    });

    conn.on("connected", () => console.log("🚜 Tractor DB Connected"));
    conn.on("error", (err) => console.error("Tractor DB connection error:", err));

    return conn;
  } catch (err) {
    console.error("Tractor DB connection error:", err);
    process.exit(1);
  }
};

// 🛻 Pickup Truck DB (third)
export const connectToPickupDB = async () => {
  try {
    const conn = await mongoose.createConnection(process.env.PICKUP_DB_URI, {
      ssl: true,
      tlsAllowInvalidCertificates: false,
      retryWrites: true,
      w: "majority",
    });

    conn.on("connected", () => console.log("🛻 Pickup DB Connected"));
    conn.on("error", (err) => console.error("Pickup DB connection error:", err));

    return conn;
  } catch (err) {
    console.error("Pickup DB connection error:", err);
    process.exit(1);
  }
};


export const connectToUserDB = async () => {
  try {
    const conn = await mongoose.createConnection(process.env.USER_DB_URI, {
      ssl: true,
      tlsAllowInvalidCertificates: false,
      retryWrites: true,
      w: "majority",
    });

    conn.on("connected", () => console.log("👤 User DB Connected"));
    conn.on("error", (err) => console.error("User DB connection error:", err));

    return conn;
  } catch (err) {
    console.error("User DB connection error:", err);
    process.exit(1);
  }
};