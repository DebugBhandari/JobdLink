import { dbConfig } from "../server.js";
import mysql from "mysql2/promise";

async function findById(userId) {
  return new Promise(async (resolve, reject) => {
    const query = `
    SELECT 
          Users.id,
          Profile.bio,
          Profile.location,
          Profile.website,
          Profile.github,
          Profile.linkedin,
          Profile.partialView,
          Users.name,
          Users.imageUrl,
          Users.email,
          COUNT(DISTINCT Jobs.id) AS count_jobs, 
          (SELECT COUNT(DISTINCT Jobs.id) FROM Jobs WHERE Jobs.private = 0 AND Jobs.user_id = Users.id) AS count_jobs_linkd 
        FROM Users
        LEFT JOIN Profile ON Profile.user_id  = Users.id
        LEFT JOIN Jobs ON Jobs.user_id =Users.id
        WHERE  Users.id = ?
        GROUP BY
          Users.id,
          Profile.bio,
          Profile.location,
          Profile.website,
          Profile.github,
          Profile.linkedin,
            Profile.partialView,
          Users.name,
          Users.imageUrl,
          Users.email;`;
    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, [userId]);
      resolve(results[0]);
      console.log(results[0]);
    } catch (error) {
      reject(error);
    } finally {
      await connection.end();
    }
  });
}
export default { findById };
