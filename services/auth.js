import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import pkg from "express";
const { req, res, next } = pkg;
import { dbConfig } from "../server.js";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import axios from "axios";
import { findUserById } from "../controllers/user.js";

export const generateToken = (user) => {
  return JWT.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
    },
    process.env.SECRET_KEY,
    { algorithm: "HS256" }
  );
};
export const createUser = async (name, email, imageUrl, linkedinId) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `INSERT INTO Users (name, email, imageUrl, linkedinId) VALUES (?, ?, ?, ?)`;
    const values = [name, email, imageUrl, linkedinId];
    const [result] = await connection.query(query, values);
    connection.end();
    return result.insertId;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (name, email, imageUrl, linkedinId) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `UPDATE Users SET name = ?, imageUrl = ? WHERE email = ?`;
    const values = [name, imageUrl, email];
    const [result] = await connection.query(query, values);
    connection.end();
    return result.affectedRows;
  } catch (error) {
    console.log(error);
  }
};

export const findUserByEmail = async (email) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `SELECT * FROM Users WHERE email = ?`;
    const [rows] = await connection.query(query, [email]);
    connection.end();
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

export const findOrCreate = async (parsedToken) => {
  try {
    const userExisting = await findUserByEmail(parsedToken.email);
    const returnedUser = {
      name: parsedToken.name,
      email: parsedToken.email,
      imageUrl: parsedToken.imageUrl,
      linkedinId: parsedToken.linkedinId,
    };
    if (userExisting) {
      console.log("User already exists");
      //Updating user each login to get a fresh image
      const updatedUserId = await updateUser(
        returnedUser.name,
        returnedUser.email,
        returnedUser.imageUrl,
        returnedUser.linkedinId
      );
      returnedUser.id = updatedUserId;
      return returnedUser;
    } else {
      console.log("Creating new user");

      const newUserId = await createUser(
        returnedUser.name,
        returnedUser.email,
        returnedUser.imageUrl,
        returnedUser.linkedinId
      );
      returnedUser.id = newUserId;
      return returnedUser;
    }
  } catch (error) {
    throw error;
  }
};

// Middleware to check if user is authenticated
export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.query.token;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized access: No token" });
    }

    // Validate token (Here we assume JWT token for example)
    const decoded = JWT.verify(token, process.env.SECRET_KEY, {
      algorithms: ["HS256"],
    });
    console.log("Decoded token:", decoded);

    // Optionally, you could check if the user exists in the DB
    const user = await findUserByEmail(decoded.email); // Assuming decoded contains user info

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach user information to the request object for further use in protected routes
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication failed:", error);
    res.status(500).json({ error: "Failed to authenticate token" });
  }
};
