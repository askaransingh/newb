

import express from "express";
import { Mechanic } from "../models/Mechanic.js";
import {
  approveMechanic,
  assignJob,
  getMechanics,
  getJobs,
  completeJobAndInvoice,
  payMechanicAdmin,
  getCompletedJobsForInvoice,
  sendInvoice,
  getJobById,
  getInvoiceHistory,
  markInvoicePaid,
  getMechanicPayoutHistory
  // payMechanicAdmin
} from "../controllers/admin.controller.js";
import { Job } from "../models/Job.js";
const router = express.Router();

router.post("/approve/:id", approveMechanic);
router.post("/assign-job", assignJob);
router.post("/invoice", completeJobAndInvoice);
router.post("/pay-mechanic", payMechanicAdmin);

router.get("/mechanics", getMechanics);
router.get("/jobs", getJobs);
router.get(
  "/completed-jobs",
  getCompletedJobsForInvoice
);

router.post(
  "/send-invoice",
 sendInvoice
);

router.delete("/mechanic/:id", async (req, res) => {
  await Mechanic.findByIdAndDelete(req.params.id);
  res.json({ message: "Mechanic deleted" });
});


router.get("/jobs/:jobId", getJobById);
router.get("/invoice-history", getInvoiceHistory);
router.post("/mark-invoice-paid", markInvoicePaid);
router.get("/mechanic/:mechanicId/payouts", getMechanicPayoutHistory);

export default router;