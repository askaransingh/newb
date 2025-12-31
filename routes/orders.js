// import express from "express";
// import Order from "../models/Order.js";

// const router = express.Router();

// // Place order
// router.post("/", async (req, res) => {
//   try {
//     const { email, items } = req.body;
//     const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     const order = new Order({ email, items, total });
//     await order.save();
//     res.status(201).json({ message: "Order placed", order });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ error: err.message });
//   }
// });

// // Get all orders (Admin)
// router.get("/", async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// Place order (UPDATED)
router.post("/", async (req, res) => {
  try {
    const {
      email,
      userName,
      userAddress,
      companyAddress,
      billingAddress,
      shippingAddress,
      items,
    } = req.body;

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      email,
      userName,
      userAddress,
      companyAddress,
      billingAddress,
      shippingAddress,
      items,
      total,
    });

    await order.save();

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Get all orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;