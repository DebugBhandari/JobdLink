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
    const query = `select Jobs.id, Jobs.jobTitle, Jobs.description, Jobs.user_id, Jobs.company, Jobs.jobUrl, Jobs.status, Jobs.location, Jobs.username, Jobs.private, Jobs.caption, COUNT(DISTINCT JobLikes.id) AS count_likes, COUNT(DISTINCT JobComments.id) AS count_comments, Users.name, Users.imageUrl from Jobs
    left join JobLikes on JobLikes.job_id = Jobs.id
    left join JobComments on JobComments.job_id = Jobs.id
    left join Users on Users.id=Jobs.user_id
    GROUP BY Jobs.id
    order by Jobs.created_at desc`;

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
    const queryJobLikes = "DELETE FROM JobLikes WHERE job_id = ?";
    const queryJobComments = "DELETE FROM JobComments WHERE job_id = ?";
    const queryJobs = "DELETE FROM Jobs WHERE id = ?";

    const connection = await mysql.createConnection(dbConfig);
    try {
      await connection.execute(queryJobLikes, [jobId]);
      await connection.execute(queryJobComments, [jobId]);
      const [results] = await connection.execute(queryJobs, [jobId]);
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
      "SELECT Users.name FROM Jobs JOIN Users ON Jobs.user_id = Users.id WHERE Jobs.id = ?";

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

async function toggleJobdLink(jobId) {
  return new Promise(async (resolve, reject) => {
    const query = "UPDATE Jobs SET private = 1 - private WHERE id = ?";
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

export default {
  create,
  findById,
  findAll,
  update,
  deleteJob,
  findJobOwner,
  toggleJobdLink,
};
