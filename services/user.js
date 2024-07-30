import { dbConfig } from "../server.js";
import mysql from "mysql2/promise";

async function findById(userId) {
  return new Promise(async (resolve, reject) => {
    const query = "SELECT * FROM Users WHERE id = ?";
    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, [userId]);
      resolve(results[0]);
    } catch (error) {
      reject(error);
    } finally {
      await connection.end();
    }
  });
}
export default { findById };
