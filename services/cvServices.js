import { dbConfig } from "../server.js";
import mysql from "mysql2/promise";

async function findCvFilename(userId) {
  const query = "SELECT cv_file FROM Users WHERE id = ?";
  const values = [userId];

  const connection = await mysql.createConnection(dbConfig);
  try {
    const [results] = await connection.execute(query, values);
    return [results]; // Return the results directly
  } catch (error) {
    throw error; // Throw error to be handled by the caller
  } finally {
    await connection.end(); // Close connection
  }
}

export default {
  findCvFilename,
};
