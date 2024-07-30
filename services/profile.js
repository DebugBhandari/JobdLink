import { dbConfig } from "../server.js";
import mysql from "mysql2/promise";

async function create(profile) {
  return new Promise(async (resolve, reject) => {
    console.log(profile);
    const query =
      "INSERT INTO Profile (user_id, bio, location, website, github, linkedin, partialView) VALUES (?, ?, ?, ?, ?,?, ?)";
    const values = [
      profile.user_id,
      profile.bio,
      profile.location,
      profile.website,
      profile.github,
      profile.linkedin,
      profile.partialView === "true" ? true : false,
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

async function findProfileByUserId(user_id) {
  return new Promise(async (resolve, reject) => {
    const query = `
        SELECT 
          Profile.id,
          Profile.user_id,
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
          (SELECT COUNT(DISTINCT Jobs.id) FROM Jobs WHERE Jobs.private = 0 AND Jobs.user_id = Profile.user_id) AS count_jobs_linkd 
        FROM Profile
        LEFT JOIN Users ON Users.id = Profile.user_id
        LEFT JOIN Jobs ON Jobs.user_id = Profile.user_id
        WHERE Profile.user_id = ?
        GROUP BY
          Profile.id,
          Profile.user_id,
          Profile.bio,
          Profile.location,
          Profile.website,
          Profile.github,
          Profile.linkedin,
            Profile.partialView,
          Users.name,
          Users.imageUrl,
          Users.email;
      `;

    const values = [user_id];

    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      const [results] = await connection.execute(query, values);

      // Check if we got any results and return the first one
      if (results.length > 0) {
        resolve(results[0]);
      } else {
        resolve(null); // No profile found for the user_id
      }
    } catch (error) {
      reject(error);
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  });
}

async function update(profileId, update) {
  return new Promise(async (resolve, reject) => {
    const query =
      "UPDATE Profile SET bio = ?, location = ?, website = ?, github = ?, linkedin = ?, partialView = ? WHERE user_id = ?";
    const values = [
      update.bio,
      update.location,
      update.website,
      update.github,
      update.linkedin,
      update.partialView === "true" ? true : false,
      update.user_id,
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

async function deleteProfile(user_id) {
  return new Promise(async (resolve, reject) => {
    const query = "DELETE FROM Profile WHERE user_id = ?";
    const values = [user_id];
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

export default {
  create,
  findProfileByUserId,
  update,
  deleteProfile,
};
