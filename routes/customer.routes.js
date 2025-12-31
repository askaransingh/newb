import express from "express";
import { createJob } from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/create-job", createJob);

export default router;