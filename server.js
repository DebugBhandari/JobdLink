import app from "./app.js";
import mysql from "mysql2/promise";

// MySQL connection
export const dbConfig = {
  host:
    process.env.NODE_ENV === "production"
      ? process.env.MYSQL_HOST
      : "localhost",
  user: process.env.MYSQL_USER, // Replace with your MySQL username
  password:
    process.env.NODE_ENV === "production"
      ? process.env.MYSQL_PASSWORD
      : "kirk8242", // Replace with your MySQL password
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
};

const initializeDb = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query(`CREATE DATABASE IF NOT EXISTS jatDb`);
    await connection.query(`
        CREATE TABLE IF NOT EXISTS Users (
          id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          imageUrl VARCHAR(255),
          linkedinId VARCHAR(255)
        )
      `);
    await connection.query(`
        CREATE TABLE IF NOT EXISTS Jobs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          jobTitle VARCHAR(255) NOT NULL,
          company VARCHAR(255) NOT NULL,
          jobUrl VARCHAR(255),
          status ENUM('Not Applied','Applied','Rejected','1st Interview', 'Task','2nd Interview','Jobd') NOT NULL,
          location VARCHAR(255),
          username VARCHAR(255),
          private BOOLEAN DEFAULT TRUE,
          description TEXT,
          caption TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES Users(id)
        )
      `);
    await connection.query(`
    CREATE TABLE IF NOT EXISTS JobLikes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        user_id INT NOT NULL,
        likedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES Jobs(id),
        FOREIGN KEY (user_id) REFERENCES Users(id),
        UNIQUE (job_id, user_id)
    )
    `);

    await connection.query(`
    CREATE TABLE IF NOT EXISTS JobComments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        user_id INT NOT NULL,
        commentedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        comment TEXT,
        FOREIGN KEY (job_id) REFERENCES Jobs(id),
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )
    `);

    await connection.query(`
    CREATE TABLE IF NOT EXISTS CommentLikes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        user_id INT NOT NULL,
        likedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES Jobs(id),
        FOREIGN KEY (user_id) REFERENCES Users(id),
        UNIQUE (job_id, user_id)
    )
    `);

    await connection.query(`
     CREATE TABLE IF NOT EXISTS Profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  bio TEXT,
  location VARCHAR(255),
  website VARCHAR(255),
  github VARCHAR(255),
  linkedin VARCHAR(255),
  partialView BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (user_id),
  FOREIGN KEY (user_id) REFERENCES Users(id)
      )`);

    await connection.end();
    console.log("Database initialized");
    app.listen(app.get("port"), () => {
      console.log(
        "  App is running at %s",
        process.env.NODE_ENV === "production"
          ? `https://jobd.link`
          : `http://localhost:${app.get("port")}`
      );
      console.log("  Press CTRL-C to stop\n");
    });
  } catch (error) {
    console.error(
      "Mysql connection error. Please make sure Mysql is running. ",
      error
    );
  }
};

initializeDb();
