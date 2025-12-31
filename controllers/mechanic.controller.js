
import bcrypt from "bcryptjs";
import { Mechanic } from "../models/Mechanic.js";
import { Job } from "../models/Job.js";
import { transporter } from "../config/mailer.js";
import multer from "multer";

import { completeJobAndInvoice } from "./admin.controller.js";


export const mechanicSignup = async (req, res) => {
  const { name, email, password, phone, skills, agreedToTerms } = req.body;

  if (!agreedToTerms)
    return res.status(400).json({ error: "Terms must be accepted" });

  const exists = await Mechanic.findOne({ email });
  if (exists)
    return res.status(400).json({ error: "Email exists" });

  const mechanic = await Mechanic.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    phone,
    skills,
    agreedToTerms,
    documents: {
      journeyman: req.files?.journeyman?.[0]?.path,
      redSeal: req.files?.redSeal?.[0]?.path,
      insurance: req.files?.insurance?.[0]?.path,
      businessInsurance: req.files?.businessInsurance?.[0]?.path,
      drivingLicense: req.files?.drivingLicense?.[0]?.path
    }
  });

  await transporter.sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: "🔧 New Mechanic Registration",
    text: `New mechanic registered: ${email}`
  });

  res.json({ message: "Registered. Awaiting admin approval." });
};


export const mechanicLogin = async (req, res) => {
  const { email, password } = req.body;

  const mechanic = await Mechanic.findOne({ email });
  if (!mechanic)
    return res.status(401).json({ error: "Invalid credentials" });

  if (!mechanic.isApproved)
    return res.status(403).json({ error: "Not approved yet" });

  const match = await bcrypt.compare(password, mechanic.password);
  if (!match)
    return res.status(401).json({ error: "Wrong password" });

  res.json({
    message: "Login successful",
    mechanic: {
      id: mechanic._id,
      name: mechanic.name,
      email: mechanic.email,
      bankDetails: mechanic.bankDetails || null
    },
    requireBankDetails: !mechanic.bankDetails?.accountNumber
  });
};

// Get assigned jobs
export const getAssignedJobs = async (req, res) => {
  const jobs = await Job.find({
    mechanic: req.params.mechanicId,
    status: "assigned"
  });

  res.json(jobs);
};

// Accept job
export const acceptJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.jobId,
    { status: "accepted" },
    { new: true }
  );

  res.json({ message: "Job accepted", job });
};

// Reject job
export const rejectJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.jobId,
    { status: "rejected", mechanic: null },
    { new: true }
  );

  res.json({ message: "Job rejected", job });
};



export const completeJob = async (req, res) => {
  const { jobId, workNote, amount } = req.body;

  const job = await Job.findByIdAndUpdate(
    jobId,
    {
      status: "completed_pending_invoice",
      mechanicNote: workNote,
      amount: Number(amount)
    },
    { new: true }
  ).populate("mechanic");

  if (!job.mechanic) {
    return res.status(500).json({
      error: "Mechanic not assigned properly to this job"
    });
  }

  // 📧 Notify admin
  await transporter.sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: "✅ Job Completed",
    text: `
Mechanic: ${job.mechanic.name}
Customer: ${job.customerName}
Email: ${job.customerEmail}
Work: ${job.problem}
Note: ${workNote}
Amount: ₹${amount}
`
  });

  res.json({
    message: "Work submitted. Waiting for admin invoice.",
    job
  });
};



export const addBankDetails = async (req, res) => {
  const mechanic = await Mechanic.findByIdAndUpdate(
    req.params.id,
    { bankDetails: req.body },
    { new: true }
  );

  res.json({
    message: "Bank details saved",
    mechanic
  });
};

// GET all jobs for mechanic (assigned + accepted + completed)
export const getMechanicJobs = async (req, res) => {
  const jobs = await Job.find({
    mechanic: req.params.mechanicId,
    status: { $in: ["assigned", "accepted", "completed_pending_invoice"] }
  }).sort({ createdAt: -1 });

  res.json(jobs);
};

export const getMechanicJobHistory = async (req, res) => {
  const jobs = await Job.find({
    mechanic: req.params.mechanicId
  }).sort({ createdAt: -1 });

  res.json(jobs);
};