import { dbConfig } from "../server.js";
import mysql from "mysql2/promise";
async function create(job) {
  return new Promise(async (resolve, reject) => {
    const query =
      "INSERT INTO Jobs (jobTitle, jobUrl, company, status, location, username, private, user_id, description, caption) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?)";
    const values = [
      job.jobTitle,
      job.jobUrl,
      job.company,
      job.status,
      job.location,
      job.username,
      job.private,
      job.user_id,
      job.description,
      job.caption,
    ];

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

async function findById(jobId) {
  return new Promise(async (resolve, reject) => {
    const query = "SELECT * FROM Jobs WHERE id = ?";

    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, [jobId]);
      if (results.length === 0) {
        reject(new Error(`Job ${jobId} not found`));
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
    const query = "SELECT * FROM Jobs ORDER BY private ASC";

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

async function update(jobId, update) {
  return new Promise(async (resolve, reject) => {
    const query =
      "UPDATE Jobs SET jobTitle = ?, jobUrl = ?, company = ?, status = ?, location = ?, username = ?, private = ?, user_id = ?, description = ?, caption = ? WHERE id = ?";
    const values = [
      update.jobTitle,
      update.jobUrl,
      update.company,
      update.status,
      update.location,
      update.username,
      update.private,
      update.user_id,
      update.description,
      update.caption,
      jobId,
    ];

    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, values);
      if (results.affectedRows === 0) {
        reject(new Error(`Job ${jobId} not found`));
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

async function deleteJob(jobId) {
  return new Promise(async (resolve, reject) => {
    const query = "DELETE FROM jobs WHERE id = ?";

    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, [jobId]);
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

async function findJobOwner(jobId) {
  return new Promise(async (resolve, reject) => {
    const query =
      "SELECT users.username FROM jobs JOIN users ON jobs.user_id = users.id WHERE jobs.id = ?";

    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(query, [jobId]);
      resolve(results[0]);
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
  deleteJob,
  findJobOwner,
};
