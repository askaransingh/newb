

// // import express from "express";
// // import  Order  from "../models/Order.js";
// // import { sendEmail } from "../utils/sendEmail.js";
// // const router = express.Router();

// // router.post("/pay-driver", async (req, res) => {
// //   const { orderId, amount } = req.body;

// //   const order = await Order.findById(orderId).populate("assignedDriver");

// //   if (!order) return res.status(404).json({ error: "Order not found" });
// //   if (order.isDriverPaid)
// //     return res.status(400).json({ error: "Driver already paid" });

// //   order.isDriverPaid = true;
// //   order.driverPaidAmount = amount;
// //   order.driverPaidAt = new Date();
// //   order.status = "Driver Paid";

// //   await order.save();

// //   await sendEmail(
// //     order.assignedDriver.email,
// //     "💸 Driver Payment Sent",
// //     `
// //       <h3>Payment Confirmation</h3>
// //       <p>Order ID: ${order._id}</p>
// //       <p>Amount Paid: ₹${amount}</p>
// //       <p>Payment sent manually by admin.</p>
// //     `
// //   );

// //   res.json({ message: "Driver paid successfully" });
// // });

// // export default router;


// import express from "express";
// import Order from "../models/Order.js";
// import { sendEmail } from "../utils/sendEmail.js";

// const router = express.Router();

// /* ===============================
//    GET DELIVERED ORDERS (ADMIN)
// ================================ */
// router.get("/delivered-orders", async (req, res) => {
//   const orders = await Order.find({
//     status: "Delivered",
//   }).populate("assignedDriver");

//   res.json(orders);
// });

// /* ===============================
//    PAY DRIVER (ADMIN – MANUAL)
// ================================ */
// router.post("/pay-driver", async (req, res) => {
//   const { orderId, amount } = req.body;

//   const order = await Order.findById(orderId).populate("assignedDriver");

//   if (!order)
//     return res.status(404).json({ error: "Order not found" });

//   if (order.isDriverPaid)
//     return res.status(400).json({ error: "Driver already paid" });

//   order.isDriverPaid = true;
//   order.driverPaidAmount = amount;
//   order.driverPaidAt = new Date();
//   order.status = "Driver Paid";

//   await order.save();

//   await sendEmail(
//     order.assignedDriver.email,
//     "💸 Driver Payment Sent",
//     `
//       <h3>Payment Confirmation</h3>
//       <p>Order ID: ${order._id}</p>
//       <p>Amount Paid: ₹${amount}</p>
//       <p>Payment sent manually by admin.</p>
//     `
//   );

//   res.json({ message: "Driver paid successfully" });
// });

// export default router;

import express from "express";
import Order from "../models/Order.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

/* ===============================
   GET DELIVERED ORDERS (ADMIN)
================================ */
router.get("/delivered-orders", async (req, res) => {
  try {
    const orders = await Order.find({ status: "Delivered" })
      .populate("assignedDriver"); // populate driver details

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch delivered orders" });
  }
});

/* ===============================
   PAY DRIVER (ADMIN – MANUAL)
================================ */
router.post("/pay-driver", async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId).populate("assignedDriver");

    if (!order) return res.status(404).json({ error: "Order not found" });
    if (!order.assignedDriver) return res.status(400).json({ error: "No driver assigned" });
    if (order.isDriverPaid) return res.status(400).json({ error: "Driver already paid" });

    // Update order payment info
    order.isDriverPaid = true;
    order.driverPaidAmount = Number(amount);
    order.driverPaidAt = new Date();
    order.status = "Driver Paid";
    await order.save();

    // Send email to driver
    await sendEmail(
      order.assignedDriver.email,
      "💸 Driver Payment Sent",
      `
        <h3>Payment Confirmation</h3>
        <p>Order ID: ${order._id}</p>
        <p>Customer: ${order.userName} (${order.email}, ${order.phone})</p>
        <p>Amount Paid: ₹${amount}</p>
        <p>Payment was sent manually by admin.</p>
      `
    );

    res.json({ message: "Driver paid successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to pay driver" });
  }
});

export default router;