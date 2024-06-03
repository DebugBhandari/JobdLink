import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import { verifyToken } from "./services/auth.js";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import jobsRouter from "./router/jobs.js";
import jobLikeRouter from "./router/jobLike.js";
import { login, register } from "./services/auth.js";
import { dbConfig } from "./server.js";

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("port", process.env.PORT || 3001);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors());

// Get user profile route (protected)
app.get("/me", verifyToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.query(
      "SELECT * FROM users WHERE id = ?",
      [req.userId]
    );
    await connection.end();

    if (results.length === 0) return res.status(404).send("No user found.");
    res.status(200).send(results[0]);
  } catch (error) {
    res.status(500).send("Error on the server.");
  }
});
app.use("/login", login);
app.use("/register", register);
app.use("/jobs", jobsRouter);
app.use("/jobLike", jobLikeRouter);

export default app;
