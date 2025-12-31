

import { Mechanic } from "../models/Mechanic.js";
import { Job } from "../models/Job.js";
import { transporter } from "../config/mailer.js";
import { createInvoiceAndSend } from "../services/invoice.service.js";
import { payMechanic } from "../services/payout.service.js";
import User from "../models-users/User.js";
// Approve mechanic
export const approveMechanic = async (req, res) => {
  const mechanic = await Mechanic.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );

  await transporter.sendMail({
    to: mechanic.email,
    subject: "Approved ✔",
    text: "You are approved. You can login now."
  });

  res.json({ message: "Mechanic approved" });
};

// Get all mechanics
export const getMechanics = async (req, res) => {
  const mechanics = await Mechanic.find();
  res.json(mechanics);
};

// Get all jobs
export const getJobs = async (req, res) => {
  const jobs = await Job.find().populate("mechanic");
  res.json(jobs);
};


export const completeJobAndInvoice = async (jobId) => {
  const job = await Job.findById(jobId).populate("mechanic");

  const amountNumber = Number(job.amount);
  if (!amountNumber || amountNumber <= 0) {
    throw new Error("Invalid job amount");
  }

  await createInvoiceAndSend(
    job.customerEmail,      // STRING ✅
    amountNumber,           // NUMBER ✅
    `Repair work: ${job.problem}` // STRING ✅
  );

  job.status = "invoice_sent";
  await job.save();
};

export const getCompletedJobsForInvoice = async (req, res) => {
  const jobs = await Job.find({
    status: "completed_pending_invoice"
  }).populate("mechanic");

  res.json(jobs);
};




import { Invoice } from "../models/Invoice.js";

export const sendInvoice = async (req, res) => {
  try {
    const { jobId, amount, description } = req.body;

    const job = await Job.findById(jobId).populate("mechanic");
    if (!job) return res.status(404).json({ error: "Job not found" });

    const invoiceId = await createInvoiceAndSend({
      customerEmail: job.customerEmail,
      customerName: job.customerName,
      address: {
        line1: job.serviceAddress.street,
        city: job.serviceAddress.city,
        state: job.serviceAddress.province,
        postal_code: job.serviceAddress.postalCode,
        country: "CA"
      },
      amount,
      description
    });

    // ✅ CREATE INVOICE RECORD
    const invoice = await Invoice.create({
      job: job._id,
      customerEmail: job.customerEmail,
      amount,
      description,
      invoiceId
    });

    console.log("INVOICE CREATED:", invoice._id);
    job.status = "Invoiced";
    await job.save();

    res.json({
      message: "Invoice sent successfully",
      invoice
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const assignJob = async (req, res) => {
  try {
    const { jobId, mechanicId } = req.body;

    if (!jobId || !mechanicId) {
      return res.status(400).json({ error: "Job ID and Mechanic ID required" });
    }

    const job = await Job.findByIdAndUpdate(
      jobId,
      {
        mechanic: mechanicId,
        status: "assigned"
      },
      { new: true }
    ).populate("mechanic");

    if (!job || !job.mechanic) {
      return res.status(404).json({ error: "Job or mechanic not found" });
    }

    // 📧 Mail mechanic with FULL details
    await transporter.sendMail({
      to: job.mechanic.email,
      subject: "🔧 New Job Assigned",
      text: `
Hello ${job.mechanic.name},

You have been assigned a new job.

Customer Details:
-----------------
Name: ${job.customerName}
Phone: ${job.customerPhone}
Email: ${job.customerEmail}

Service Address:
----------------
${job.serviceAddress.street},
${job.serviceAddress.city},
${job.serviceAddress.province} ${job.serviceAddress.postalCode},
${job.serviceAddress.country || "Canada"}

Problem:
---------
${job.problem}
`
    });

    res.json({
      message: "Job assigned successfully",
      job
    });

  } catch (err) {
    console.error("Assign Job Error:", err);
    res.status(500).json({ error: "Server error while assigning job" });
  }
};



// GET single job for invoice
export const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.jobId)
    .populate("mechanic");

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.json(job);
};


export const getInvoiceHistory = async (req, res) => {
  const invoices = await Invoice.find()
    .populate({
      path: "job",
      populate: { path: "mechanic" }
    })
    .sort({ createdAt: -1 });

  res.json(invoices);
};

export const markInvoicePaid = async (req, res) => {
  const { invoiceId } = req.body;

  const invoice = await Invoice.findByIdAndUpdate(
    invoiceId,
    { status: "Paid" },
    { new: true }
  );

  res.json({ message: "Invoice marked as paid", invoice });
};




// export const payMechanicAdmin = async (req, res) => {
//   try {
//     const { invoiceId } = req.body;

//     const invoice = await Invoice.findById(invoiceId)
//       .populate({
//         path: "job",
//         populate: { path: "mechanic" }
//       });

//     if (!invoice) {
//       return res.status(404).json({ error: "Invoice not found" });
//     }

//     if (invoice.status !== "Paid") {
//       return res.status(400).json({ error: "Invoice not paid by customer yet" });
//     }

//     if (invoice.isMechanicPaid) {
//       return res.status(400).json({ error: "Mechanic already paid" });
//     }

//     const mechanic = invoice.job.mechanic;

//     // ✅ MARK AS PAID (MANUAL PAYMENT DONE OUTSIDE APP)
//     invoice.isMechanicPaid = true;
//     invoice.mechanicPaidAt = new Date();
//     await invoice.save();

//     // ✅ EMAIL CONFIRMATION
//     await transporter.sendMail({
//       to: mechanic.email,
//       subject: "💸 Payment Sent",
//       text: `
// Hello ${mechanic.name},

// This is to confirm that your payment for the job has been sent.

// Job ID: ${invoice.job._id}
// Invoice ID: ${invoice._id}
// Amount: ${invoice.amount}

// Payment was made manually by admin (e-transfer / cash / bank).

// Thank you for your service.
// `
//     });

//     res.json({
//       message: "Mechanic marked as paid (manual payment)",
//     });

//   } catch (err) {
//     console.error("Pay Mechanic Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };
export const payMechanicAdmin = async (req, res) => {
  try {
    const { invoiceId } = req.body;

    const invoice = await Invoice.findById(invoiceId).populate({
      path: "job",
      populate: { path: "mechanic" }
    });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    if (invoice.status !== "Paid") {
      return res.status(400).json({ error: "Invoice not paid by customer yet" });
    }

    if (invoice.isMechanicPaid) {
      return res.status(400).json({ error: "Mechanic already paid" });
    }

    const job = invoice.job;
    const mechanic = job.mechanic;

    // ✅ MARK INVOICE AS PAID TO MECHANIC
    invoice.isMechanicPaid = true;
    invoice.mechanicPaidAt = new Date();
    await invoice.save();

    // ✅ UPDATE JOB STATUS
    job.status = "mechanic_paid";
    await job.save();

    // ✅ EMAIL CONFIRMATION TO MECHANIC
    await transporter.sendMail({
      to: mechanic.email,
      subject: "💸 Payment Sent",
      text: `
Hello ${mechanic.name},

This is to confirm that your payment for the job has been sent.

Job ID: ${job._id}
Invoice ID: ${invoice._id}
Amount: ${invoice.amount}

Payment was made manually by admin (e-transfer / cash / bank).

Thank you for your service.
`
    });

    res.json({
      message: "Mechanic marked as paid successfully"
    });

  } catch (err) {
    console.error("Pay Mechanic Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET all jobs for mechanic (assigned + accepted + completed)
export const getMechanicJobs = async (req, res) => {
  const jobs = await Job.find({
    mechanic: req.params.mechanicId,
    status: { $in: ["assigned", "accepted", "completed_pending_invoice"] }
  }).sort({ createdAt: -1 });

  res.json(jobs);
};

// GET payout history for mechanic
export const getMechanicPayoutHistory = async (req, res) => {
  const { mechanicId } = req.params;

  const payouts = await Invoice.find({
    isMechanicPaid: true
  })
    .populate({
      path: "job",
      match: { mechanic: mechanicId },
      populate: { path: "mechanic" }
    })
    .sort({ mechanicPaidAt: -1 });

  // remove null jobs (non-matching)
  const filtered = payouts.filter(p => p.job);

  res.json(filtered);
};