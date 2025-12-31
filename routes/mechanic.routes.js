
import express from "express";
import {
  mechanicSignup,
  mechanicLogin,
  getAssignedJobs,
  acceptJob,
  rejectJob,
  completeJob,
  addBankDetails,
  getMechanicJobs,
  getMechanicJobHistory
} from "../controllers/mechanic.controller.js";
import multer from "multer";
const router = express.Router();

// router.post("/signup", mechanicSignup);

const upload = multer({ dest: "uploads/" });
// const router = express.Router();

router.post("/signup",
  upload.fields([
    { name: "journeyman" },
    { name: "redSeal" },
    { name: "drivingLicense" },
    { name: "insurance" },
    { name: "businessInsurance" }
  ]),
  mechanicSignup
);
router.post("/login", mechanicLogin);

// dashboard
// router.get("/jobs/:mechanicId", getAssignedJobs);
router.put("/accept-job/:jobId", acceptJob);
router.put("/reject-job/:jobId", rejectJob);
router.post("/complete-job", completeJob);
router.get("/jobs/:mechanicId", getMechanicJobs);
router.get("/job-history/:mechanicId", getMechanicJobHistory); 



// routes/mechanic.js
router.put("/complete-job/:jobId", async (req, res) => {
  const { mechanicNote, amount } = req.body;

  const job = await Job.findByIdAndUpdate(
    req.params.jobId,
    {
      mechanicNote,
      amount,
      status: "Completed"
    },
    { new: true }
  );

  res.json(job);
});


router.post(
  "/:id/bank-details",
  addBankDetails
);
export default router;