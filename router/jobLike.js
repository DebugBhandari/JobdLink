import express from "express";
import { verifyToken } from "../services/auth.js";

import {
  createJobLike,
  findById,
  deleteJobLike,
  findAll,
  updateJobLike,
} from "../controllers/jobLike.js";

const router = express.Router();

// Every path we define here will get /api/v1/movies prefix
router.get("/", findAll);
router.get("/:jobLikeId", findById);
router.put("/:jobLikeId", updateJobLike);
router.delete("/:jobLikeId", deleteJobLike);
router.post("/", createJobLike);

export default router;
