import express from "express";

import {
  createJob,
  findById,
  deleteJob,
  findAll,
  updateJob,
  findJobOwner,
  toggleJobdLink,
} from "../controllers/job.js";
import { isAuth } from "../services/auth.js";

const router = express.Router();

// Every path we define here will get /api/v1/movies prefix
router.get("/", findAll);
router.get("/:jobId", findById);
router.put("/:jobId", updateJob);
router.delete("/:jobId", deleteJob);
router.post("/", createJob);
router.get("/:jobId/user", findJobOwner);
router.put("/toggle/:jobId", toggleJobdLink);

export default router;
