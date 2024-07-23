import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
//import { generateToken } from "./services/auth.js";
import mysql from "mysql2/promise";
import cors from "cors";
import axios from "axios";
import path from "path";

const app = express();
app.use(express.json());
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import jobsRouter from "./router/jobs.js";
import jobLikeRouter from "./router/jobLike.js";
import jobCommentRouter from "./router/jobComments.js";
import { dbConfig } from "./server.js";

import passport from "passport";
//import session from "express-session";
import { v4 as uuidv4 } from "uuid";
// import passport.js
import "./utils/passport.js";

export const baseUrl =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3001";

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
  next();
});
app.use(cors());

// //use the session middleware
// var sess = {
//   genid: function (req) {
//     return uuidv4(); // use UUIDs for session IDs
//   },
//   secret: process.env.SESSION_SECRET,
//   cookie: {
//     maxAge: 24 * 60 * 60 * 1000,
//   },
// };

// if (app.get("env") === "production") {
//   app.set("trust proxy", 1); // trust first proxy
//   sess.cookie.secure = true; // serve secure cookies
// }

//app.use(session(sess));

// initialize passport and session

app.use(passport.initialize());
//app.use(passport.session(sess));

// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res, next) => {
//     const { id, name, email, imageUrl } = req.user;
//     const token = generateToken(req.user);
//     console.log("Do we have a user??", req.user);
//     res.redirect(
//       `http://localhost:3000?token=${token}&name=${encodeURIComponent(
//         name
//       )}&email=${encodeURIComponent(email)}&imageUrl=${encodeURIComponent(
//         imageUrl
//       )}&id=${id}`
//     );

app.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", { state: "SOME STATE" })
);

app.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", { session: false }),
  (req, res, next) => {
    const { id, name, email, imageUrl, linkedinId } = req.user.createdFoundUser;
    console.log("req.user", req.user.createdFoundUser);
    const { accessToken } = req.user;
    // const token = generateToken(req.user);
    // console.log("token", token);
    //console.log("Do we have a user??", req.user);
    res.redirect(
      `${baseUrl}?token=${encodeURIComponent(
        accessToken
      )}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(
        email
      )}&imageUrl=${encodeURIComponent(
        imageUrl
      )}&id=${id}&linkedinId=${linkedinId}`
    );

    // Redirect to React frontend
  }
);

app.post("/share", async (req, res) => {
  const { token, content, linkedinId } = req.body;
  console.log(linkedinId);

  try {
    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: `urn:li:person:${linkedinId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// app.use("/profile", (req, res) => {
//   if (req.session.isAuthenticated) {
//     res.send(req.session.user);
//   } else {
//     res.status(401).send("Unauthorized");
//   }
// });
console.log("baseUrl", baseUrl);
app.use("/jobs", jobsRouter);
app.use("/jobLike", jobLikeRouter);
app.use("/jobComment", jobCommentRouter);

if (process.env.NODE_ENV || "development") {
  app.use(express.static("jatfront/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("jatfront", "build", "index.html"));
  });
}

export default app;
