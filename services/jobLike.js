import { dbConfig } from "../server.js";
import mysql from "mysql2/promise";
async function create(jobLike) {
  return new Promise(async (resolve, reject) => {
    const query =
      "INSERT INTO JobLikes (job_id, user_id, likedAt) VALUES (?, ?, ?)";
    const values = [jobLike.job_id, jobLike.user_id, jobLike.likedAt];

    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, values);
      resolve(results);
    } catch (error) {
      reject(error);
    } finally {
      await connection.end();
    }
  });
}

async function findById(jobLikeId) {
  return new Promise(async (resolve, reject) => {
    const query = "SELECT * FROM JobLikes WHERE id = ?";

    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, [jobLikeId]);
      if (results.length === 0) {
        reject(new Error(`Joblike ${jobLikeId} not found`));
      } else {
        resolve(results[0]);
      }
    } catch (error) {
      reject(error);
    } finally {
      await connection.end();
    }
  });
}

async function findAll() {
  return new Promise(async (resolve, reject) => {
    const query = "SELECT * FROM JobLikes ORDER BY likedAt ASC";

    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query);
      resolve(results);
    } catch (error) {
      reject(error);
    } finally {
      await connection.end();
    }
  });
}

async function update(jobLikeId, update) {
  return new Promise(async (resolve, reject) => {
    const query =
      "UPDATE JobLikes SET job_id = ?, user_id = ?, likedAt = ? WHERE id = ?";
    const values = [
      jobLike.job_id,
      jobLike.user_id,
      jobLike.likedAt,
      jobLikeId,
    ];

    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, values);
      if (results.affectedRows === 0) {
        reject(new Error(`Joblike ${jobLikeId} not found`));
      } else {
        resolve(results);
      }
    } catch (error) {
      reject(error);
    } finally {
      await connection.end();
    }
  });
}

async function deleteJobLike(jobLikeId) {
  return new Promise(async (resolve, reject) => {
    const query = "DELETE FROM JobLikes WHERE id = ?";

    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, [jobLikeId]);
      if (results.affectedRows === 0) {
        resolve(null);
      } else {
        resolve(results);
      }
    } catch (error) {
      reject(error);
    } finally {
      await connection.end();
    }
  });
}

export default {
  create,
  findById,
  findAll,
  update,
  deleteJobLike,
};
