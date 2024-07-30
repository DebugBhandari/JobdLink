import express from "express";

import {
  createProfile,
  deleteProfile,
  updateProfile,
  findProfileByUserId,
} from "../controllers/profile.js";

const router = express.Router();

router.post("/", createProfile);
router.put("/:profileId", updateProfile);
router.delete("/:profileId", deleteProfile);
router.get("/:profileId", findProfileByUserId);
export default router;
