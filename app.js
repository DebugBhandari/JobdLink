import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
//import { generateToken } from "./services/auth.js";
import mysql from "mysql2/promise";
import cors from "cors";
import axios from "axios";
import path from "path";
import fs from "fs";
import multer from "multer";
import pdfParse from "pdf-parse";

const app = express();
app.use(express.json());
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import jobsRouter from "./router/jobs.js";
import jobLikeRouter from "./router/jobLike.js";
import jobCommentRouter from "./router/jobComments.js";
import profileRouter from "./router/profile.js";
import userRouter from "./router/user.js";
import cvRouter from "./router/cv.js";
import { dbConfig } from "./server.js";
import extractResumeData from "./utils/resumeExtractor.js";
import { storeTokens } from "./services/token.js";
import { findOrCreate, generateToken, isAuth } from "./services/auth.js";
import {
  uploadImageToLinkedIn,
  shareOnLinkedIn,
} from "./utils/linkedinHelpers.js";
import aiChat from "./utils/aichat.js";

import passport from "passport";
//import session from "express-session";
import { v4 as uuidv4 } from "uuid";
// import passport.js
import "./utils/passport.js";

import tailorCv from "./utils/tailorCv.js";

export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://jobd.link";

const redirectUriConditional =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001/auth/linkedin/callback"
    : "https://jobd.link/auth/linkedin/callback";

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("port", process.env.PORT || 3001);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.set("Cache-Control", "no-store");
  next();
});
app.use(cors());

// app.use(passport.initialize());

// app.get(
//   "/auth/linkedin",
//   passport.authenticate("linkedin", { state: "SOME STATE" })
// );

// app.get(
//   "/auth/linkedin/callback",
//   passport.authenticate("linkedin", { session: false }),
//   (req, res, next) => {
//     const { id, name, email, imageUrl, linkedinId } = req.user.createdFoundUser;
//     console.log("req.user", req.user.createdFoundUser);
//     const { accessToken } = req.user;
//     // const token = generateToken(req.user);
//     // console.log("token", token);
//     //console.log("Do we have a user??", req.user);
//     res.redirect(
//       `${baseUrl}?token=${encodeURIComponent(
//         accessToken
//       )}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(
//         email
//       )}&imageUrl=${encodeURIComponent(
//         imageUrl
//       )}&id=${id}&linkedinId=${linkedinId}`
//     );

// Redirect to React frontend
//  }
//);
app.get("/auth/linkedin", (req, res) => {
  const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${
    process.env.LINKEDIN_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    process.env.LINKEDIN_REDIRECT_URI
  )}&state=randomstring&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
  res.redirect(linkedInAuthUrl);
});

// LinkedIn callback route
app.get("/auth/linkedin/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res
      .status(400)
      .json({ error: "Authorization code or state missing" });
  }

  try {
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUriConditional,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, expires_in, id_token, scope } = tokenResponse.data;

    const scopes = scope ? scope.split(" ") : [];

    const idTokenPayload = jwt.decode(id_token);
    const idTokenData = {
      name: idTokenPayload.name,
      email: idTokenPayload.email,
      imageUrl: idTokenPayload.picture,
      linkedinId: idTokenPayload.sub,
    };
    console.log("ID Token Payload:", idTokenData);

    const createdFoundUser = await findOrCreate(idTokenData);

    // Save tokens and inferred expiration in your database

    await storeTokens(createdFoundUser.id, access_token, expires_in);
    const jwtToken = generateToken(createdFoundUser);

    res.redirect(
      `${baseUrl}?token=${encodeURIComponent(
        jwtToken
      )}&name=${encodeURIComponent(
        createdFoundUser.name
      )}&email=${encodeURIComponent(
        createdFoundUser.email
      )}&imageUrl=${encodeURIComponent(createdFoundUser.imageUrl)}&id=${
        createdFoundUser.id
      }&linkedinId=${createdFoundUser.linkedinId}`
    );
  } catch (error) {
    console.error(
      "Error exchanging code for token:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to obtain access token" });
  }
});

// Set up storage with Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/upload", isAuth, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  console.log(`File uploaded: ${fileUrl}`);
  res.json({ url: fileUrl });
});

app.use("/uploads", express.static("uploads"));
app.use("/uploads/cvs", express.static("cvs"));

app.post("/share", isAuth, async (req, res) => {
  const { imageUrl, linkedinId, token, job_id, postComment } = req.body;

  try {
    const imageUrn = await uploadImageToLinkedIn(
      imageUrl,
      linkedinId,
      req.user.accessToken
    );
    const result = await shareOnLinkedIn(
      imageUrn,
      linkedinId,
      req.user.accessToken,
      job_id,
      postComment
    );

    // Delete the file after sharing

    const fileName = path.basename(imageUrl);
    const filePath = path.resolve("uploads", fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file after sharing: ${fileName}`);
    }

    res.json({ message: "Shared successfully on LinkedIn!", data: result });
  } catch (error) {
    console.error("Error sharing on LinkedIn:", error);
    res.status(500).send("Error sharing on LinkedIn");
  }
});

app.use("/jobs", jobsRouter);
app.use("/jobLike", jobLikeRouter);
app.use("/jobComment", jobCommentRouter);
app.use("/profile", profileRouter);
app.use("/user", userRouter);
//Endpoint to upload/delete cv
app.use("/cv", cvRouter);

// Endpoint to Extract and Tailor CV
app.post("/tailor-cv", tailorCv);
app.post("/ai-chat", aiChat);

if (process.env.NODE_ENV || "development") {
  // Serve static files from the React app
  app.use(
    express.static("jatfront/build", {
      etag: false,
      lastModified: false,
      setHeaders: (res, path) => {
        res.setHeader("Cache-Control", "no-store");
      },
    })
  );

  // Serve the React app for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("jatfront", "build", "index.html"));
  });
}

export default app;
