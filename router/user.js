import express from "express";

import { findUserById } from "../controllers/user.js";
import { isAuth } from "../services/auth.js";

const router = express.Router();

// Every path we define here will get /api/v1/movies prefix
router.get("/:userId", findUserById);

export default router;
