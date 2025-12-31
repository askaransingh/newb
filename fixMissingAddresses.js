// fixMissingAddresses.js
import mongoose from "mongoose";
import Order from "./models/Order.js"; // Adjust path to your Order model

// ✅ Connect to MongoDB
const MONGO_URI = "mongodb+srv://jaskaransingh70262_db_user:3TwtdCfgujyBhbVS@cluster0.ecrjqvj.mongodb.net/"; // Replace with your DB URI

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

async function fixOrders() {
  try {
    // 1️⃣ Find orders missing billingAddress or shippingAddress
    const orders = await Order.find({
      $or: [
        { billingAddress: { $exists: false } },
        { shippingAddress: { $exists: false } }
      ]
    });

    console.log(`Found ${orders.length} orders with missing addresses.`);

    // 2️⃣ Loop through and fix them
    for (let order of orders) {
      let updated = false;

      if (!order.billingAddress || Object.keys(order.billingAddress).length === 0) {
        // Fallback: copy from companyAddress or userAddress
        order.billingAddress = order.companyAddress || order.userAddress || {};
        updated = true;
      }

      if (!order.shippingAddress || Object.keys(order.shippingAddress).length === 0) {
        // Fallback: copy from userAddress
        order.shippingAddress = order.userAddress || {};
        updated = true;
      }

      if (updated) {
        await order.save();
        console.log(`✅ Updated order ${order._id}`);
      }
    }

    console.log("🎉 All missing addresses fixed!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Error fixing orders:", err);
    process.exit(1);
  }
}

fixOrders();