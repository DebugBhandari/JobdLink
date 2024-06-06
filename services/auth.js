import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pkg from "express";
const { req, res, next } = pkg;
import { dbConfig } from "../server.js";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (token && process.env.SECRET_KEY) {
    jwt.verify(
      JSON.parse(token),
      process.env.SECRET_KEY,
      (err, decodedToken) => {
        if (err) {
          return res.status(401).send({ message: "Innvalid Token" });
        }
        req.user = decodedToken;
        console.log("User verified:", decodedToken);
        next();
      }
    );
  } else {
    return res.status(401).send({ message: "Invalid Token" });
  }
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    await connection.end();

    if (results.length === 0) return res.status(404).send("No user found.");

    const user = results[0];
    console.log("User found:", user);
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send("Password is invalid.");
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: 86400,
    });
    res.status(200).send({ user, token, userId: user.id });
    console.log("User logged in successfully");
  } catch (error) {
    res.status(500).send("Error on the server.");
    next(console.log(error));
  }
};

export const register = async (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).send("Missing required fields");
  }
  const salt = await bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hashSync(password, salt);

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query(
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
      [username, hashedPassword, email]
    );
    await connection.end();
    res.status(201).send({
      message:
        "User registered successfully. New User " + username + " created.",
    });
  } catch (error) {
    res.status(500).send("Error on the server.");
    next(console.log(error.response.data));
  }
};
