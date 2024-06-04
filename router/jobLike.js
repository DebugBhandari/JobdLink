import express from "express";
import { verifyToken } from "../services/auth.js";

import {
  createJobLike,
  findById,
  deleteJobLike,
  findAll,
  updateJobLike,
  findByJobId,
  findByUserJLJoin,
  hasUserLikedJob,
} from "../controllers/jobLike.js";

const router = express.Router();

// Every path we define here will get /api/v1/movies prefix
router.get("/", findAll);
router.put("/:jobLikeId", updateJobLike);
router.delete("/:jobId/:userId", deleteJobLike);
router.get("/:jobId/:userId/bool", hasUserLikedJob);
router.post("/", createJobLike);
//joblikes By JobID
router.get("/:jobId", findByJobId);

//Join get userNames
router.get("/:jobId/usernames", findByUserJLJoin);

export default router;
