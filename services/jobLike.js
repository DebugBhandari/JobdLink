import { dbConfig } from "../server.js";
import mysql from "mysql2/promise";

async function create(jobLike) {
  return new Promise(async (resolve, reject) => {
    const query = "INSERT INTO JobLikes (job_id, user_id) VALUES (?, ?)";
    const values = [jobLike.job_id, jobLike.user_id];

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
//Find by Job ID
async function findByJobId(jobId) {
  return new Promise(async (resolve, reject) => {
    const query = "SELECT * FROM JobLikes WHERE job_id = ?";

    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, [jobId]);
      if (results.length === 0) {
        reject(new Error(`JobLikes for ${jobId} not found`));
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

async function findAll(userId) {
  return new Promise(async (resolve, reject) => {
    const query = "SELECT * FROM JobLikes WHERE user_id = ?";

    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, [userId]);
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

async function deleteJobLike(jobId, userId) {
  return new Promise(async (resolve, reject) => {
    const query = "DELETE FROM JobLikes WHERE job_id = ? AND user_id = ?";
    const values = [jobId, userId];
    console.log;
    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, values);
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

//Find Usernames by Joining Users Table
async function findByUserJLJoin(job_id) {
  return new Promise(async (resolve, reject) => {
    const query =
      "SELECT Users.name FROM Users INNER JOIN JobLikes ON JobLikes.user_id = Users.id where JobLikes.job_id = ?";
    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, [job_id]);
      resolve(results);
    } catch (error) {
      reject(error);
    } finally {
      await connection.end();
    }
  });
}

//Find if User has liked a Job
async function hasUserLikedJob(job_id, user_id) {
  return new Promise(async (resolve, reject) => {
    const query = "SELECT * FROM JobLikes WHERE job_id = ? AND user_id = ?";
    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, [job_id, user_id]);
      if (results.length === 0) {
        resolve("false");
      } else {
        resolve("true");
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
  findByJobId,
  findByUserJLJoin,
  hasUserLikedJob,
};
