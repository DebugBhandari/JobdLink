import { dbConfig } from "../server.js";
import mysql from "mysql2/promise";

export const storeTokens = async (userId, accessToken, expiresIn) => {
  const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000); // Convert expiresIn (in seconds) to a timestamp
  const connection = await mysql.createConnection(dbConfig);
  await connection.execute(
    `UPDATE Users 
       SET accessToken = ?, tokenExpiresAt = ? 
       WHERE id = ?`,
    [accessToken, tokenExpiresAt, userId]
  );
  await connection.end();
};

const isTokenValid = async (userId) => {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute(
    `SELECT accessToken, tokenExpiresAt FROM Users WHERE id = ?`,
    [userId]
  );
  await connection.end();
  if (rows.length === 0) return false;

  const { accessToken, tokenExpiresAt } = rows[0];
  if (!accessToken || new Date(tokenExpiresAt) < new Date()) {
    return false; // Token is invalid or expired
  }
  return accessToken; // Return valid token
};

const refreshAccessToken = async (userId) => {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute(
    `SELECT refreshToken FROM Users WHERE id = ?`,
    [userId]
  );

  if (rows.length === 0) throw new Error("User not found");

  const { refreshToken } = rows[0];

  // Request a new access token using the refresh token
  const response = await axios.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    }).toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const { access_token, expires_in } = response.data;
  const tokenExpiresAt = new Date(Date.now() + expires_in * 1000);

  // Update the database with the new token

  await connection.execute(
    `UPDATE Users SET accessToken = ?, tokenExpiresAt = ? WHERE id = ?`,
    [access_token, tokenExpiresAt, userId]
  );
  await connection.end();

  return access_token;
};
