import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import pkg from "express";
const { req, res, next } = pkg;
import { dbConfig } from "../server.js";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// export const generateToken = (user) => {
//   return JWT.sign(
//     {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       imageUrl: user.picture,
//     },
//     process.env.SECRET_KEY
//   );
// };
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
    const userExisting = await findUserByEmail(parsedToken.payload.email);
    const returnedUser = {
      name: parsedToken.payload.name,
      email: parsedToken.payload.email,
      imageUrl: parsedToken.payload.imageUrl,
      linkedinId: parsedToken.payload.linkedinId,
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

export const isAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).send("No token provided");
  }
  try {
    const decoded = JWT.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
};
