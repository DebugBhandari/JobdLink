import express from "express";

import {
  createJob,
  findById,
  deleteJob,
  findAll,
  updateJob,
  findJobOwner,
  toggleJobdLink,
  findJobByUser,
} from "../controllers/job.js";
import { isAuth } from "../services/auth.js";

const router = express.Router();

// Every path we define here will get /api/v1/movies prefix
router.get("/", findAll);
router.get("/:jobId", findById);
router.put("/:jobId", isAuth, updateJob);
router.delete("/:jobId", isAuth, deleteJob);
router.post("/", isAuth, createJob);
router.get("/:jobId/user", findJobOwner);
router.put("/toggle/:jobId", isAuth, toggleJobdLink);
router.get("/user/:userId", findJobByUser);

export default router;
