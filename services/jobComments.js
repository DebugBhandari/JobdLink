import { dbConfig } from "../server.js";
import mysql from "mysql2/promise";

async function create(jobComment) {
  return new Promise(async (resolve, reject) => {
    const query =
      "INSERT INTO JobComments (job_id, user_id, comment) VALUES (?, ?, ?)";
    const values = [jobComment.job_id, jobComment.user_id, jobComment.comment];

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

//Find by Job ID
async function findByJobId(jobId) {
  return new Promise(async (resolve, reject) => {
    const query = `SELECT JobComments.comment, users.username, users.email, jobComments.id, jobComments.commentedAt FROM JobComments
    JOIN users ON JobComments.user_id = users.id
    WHERE job_id = ? ORDER BY commentedAt DESC`;

    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, [jobId]);
      resolve(results);
    } catch (error) {
      reject(error);
    } finally {
      await connection.end();
    }
  });
}

async function findAll() {
  return new Promise(async (resolve, reject) => {
    const query = "SELECT * FROM JobComments ORDER BY likedAt ASC";

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

async function update(jobCommentId, update) {
  return new Promise(async (resolve, reject) => {
    const query = "UPDATE JobComments SET comment = ? WHERE id = ?";
    const values = [update.comment, jobCommentId];

    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, values);
      if (results.affectedRows === 0) {
        reject(new Error(`Comment ${jobCommentId} not found`));
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

async function deleteJobComment(commentId, userId) {
  return new Promise(async (resolve, reject) => {
    const query = "DELETE FROM JobComments WHERE id = ? AND user_id = ?";
    const values = [commentId, userId];
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

export default {
  create,
  findAll,
  update,
  deleteJobComment,
  findByJobId,
};
