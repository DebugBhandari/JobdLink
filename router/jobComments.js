import express from "express";
import { verifyToken } from "../services/auth.js";

import {
  createJobComment,
  findById,
  deleteJobComment,
  findAll,
  updateJobComment,
  findByJobId,
} from "../controllers/jobComments.js";

const router = express.Router();

// Every path we define here will get /api/v1/movies prefix
router.get("/", findAll);
router.put("/:jobCommentId", updateJobComment);
router.delete("/:jobId/:userId", deleteJobComment);
router.post("/", createJobComment);
//joblikes By JobID
router.get("/:jobId", findByJobId);

export default router;
