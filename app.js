import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import { verifyToken } from "./services/auth.js";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
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

// // Register route
// app.post("/register", async (req, res) => {
//   const { username, password, email } = req.body;
//   if (!username || !password || !email) {
//     return res.status(400).send("Missing required fields");
//   }
//   const salt = await bcrypt.genSaltSync(10);
//   const hashedPassword = await bcrypt.hashSync(password, salt);

//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     await connection.query(
//       "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
//       [username, hashedPassword, email]
//     );
//     await connection.end();
//     res.status(201).send({
//       message:
//         "User registered successfully. New User " + username + " created.",
//     });
//   } catch (error) {
//     res.status(500).send("Error on the server.");
//     console.log(error.response.data);
//   }
// });

// // Login route
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const [results] = await connection.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email]
//     );
//     await connection.end();

//     if (results.length === 0) return res.status(404).send("No user found.");

//     const user = results[0];
//     console.log("User found:", user);
//     const passwordIsValid = bcrypt.compareSync(password, user.password);
//     if (!passwordIsValid) return res.status(401).send("Password is invalid.");
//     const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
//       expiresIn: 86400,
//     });
//     res.status(200).send({ user, token });
//     console.log("User logged in successfully");
//   } catch (error) {
//     res.status(500).send("Error on the server.");
//     console.log(error);
//   }
// });

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
