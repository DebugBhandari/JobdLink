import express from "express";

import { uploadCv, getCv, deleteCv } from "../controllers/cv.js";
import { isAuth } from "../services/auth.js";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Directory for storing uploaded CVs
export const cvDirectory = path.resolve(__dirname, "../uploads/cvs");

// Ensure the directory exists
if (!fs.existsSync(cvDirectory)) {
  fs.mkdirSync(cvDirectory, { recursive: true });
}

// Multer storage for CV uploads
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, cvDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const cvUpload = multer({ storage: cvStorage });

// POST endpoint for uploading a CV
router.post("/upload", isAuth, cvUpload.single("cv"), uploadCv); // 'cv' is the field name in the form

// GET endpoint to retrieve a CV for a specific user
router.get("/:userId", getCv);

// DELETE endpoint to remove a CV for a specific user
router.delete("/:userId", isAuth, deleteCv);

export default router;
