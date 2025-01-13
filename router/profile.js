import express from "express";

import {
  createProfile,
  deleteProfile,
  updateProfile,
  findProfileByUserId,
  toggleProfilePartial,
} from "../controllers/profile.js";
import { isAuth } from "../services/auth.js";

const router = express.Router();

router.post("/", isAuth, createProfile);
router.put("/:profileId", isAuth, updateProfile);
router.delete("/:profileId", isAuth, deleteProfile);
router.get("/:profileId", findProfileByUserId);
router.put("/toggle/:userId", isAuth, toggleProfilePartial);

export default router;
