import pkg from "express";
const { req, res, next } = pkg;
//import JobService from "../services/cv.js";
import path from "path";
import fs from "fs";
import mysql from "mysql2/promise";
import { dbConfig } from "../server.js";
import { cvDirectory } from "../router/cv.js";

// POST /jobs
export const uploadCv = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No CV uploaded" });
  }

  const userId = req.body.userId; // Assume the frontend sends the user's ID
  const newFileName = req.file.filename;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Check if the user already has an existing CV
    const [rows] = await connection.execute(
      "SELECT cv_file FROM users WHERE id = ?",
      [userId]
    );
    const oldFileName = rows[0]?.cv_file;

    // Delete the old CV file if it exists
    if (oldFileName) {
      const oldFilePath = path.join("uploads", "cvs", oldFileName);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log(`Deleted old CV: ${oldFileName}`);
      }
    }

    // Save the new CV filename in the database
    await connection.execute("UPDATE users SET cv_file = ? WHERE id = ?", [
      newFileName,
      userId,
    ]);
    await connection.end();

    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/cvs/${newFileName}`;
    console.log("fileUrl", fileUrl);
    res.status(200).json({ url: fileUrl, fileName: newFileName });
  } catch (error) {
    console.error("Error saving CV to database:", error);
    res.status(500).json({ error: "Failed to save CV" });
  }
};

// PUT /jobs/:jobId
export const getCv = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT cv_file FROM users WHERE id = ?",
      [userId]
    );
    await connection.end();

    if (rows.length > 0 && rows[0].cv_file) {
      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/cvs/${
        rows[0].cv_file
      }`;
      res.status(200).json({ url: fileUrl, fileName: rows[0].cv_file });
    } else {
      res.status(404).json({ error: "No CV found for user" });
    }
  } catch (error) {
    console.error("Error fetching CV from database:", error);
    res.status(500).json({ error: "Failed to fetch CV" });
  }
};

// DELETE /jobs/:jobId
export const deleteCv = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Fetch existing CV filename
    const [rows] = await connection.execute(
      "SELECT cv_file FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0 || !rows[0].cv_file) {
      return res.status(404).json({ error: "No CV found for user" });
    }

    const filePath = path.join(cvDirectory, rows[0].cv_file);

    // Delete CV file from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove CV reference from database
    await connection.execute("UPDATE users SET cv_file = NULL WHERE id = ?", [
      userId,
    ]);
    await connection.end();

    res.status(200).json({ message: "CV deleted successfully" });
  } catch (error) {
    console.error("Error deleting CV from database:", error);
    res.status(500).json({ error: "Failed to delete CV" });
  }
};
