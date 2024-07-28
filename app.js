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
import cron from "node-cron";

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
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://jobd.link";

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const fileUrl = `https://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

app.use("/uploads", express.static("uploads"));

const uploadImageToLinkedIn = async (imageUrl, linkedinId, accessToken) => {
  try {
    const registerUploadResponse = await axios.post(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      {
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          owner: `urn:li:person:${linkedinId}`,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const uploadUrl =
      registerUploadResponse.data.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;
    const asset = registerUploadResponse.data.value.asset;

    // Upload the image to LinkedIn
    await axios.put(uploadUrl, fs.readFileSync(imageUrl), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "image/png",
      },
    });

    return asset;
  } catch (error) {
    console.error(
      "Error uploading image to LinkedIn:",
      error.response ? error.response.data : error
    );
    throw new Error("Failed to upload image to LinkedIn.");
  }
};

const shareOnLinkedIn = async (imageUrn, linkedinId, accessToken) => {
  try {
    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: `urn:li:person:${linkedinId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: "Check out this image!",
            },
            shareMediaCategory: "IMAGE",
            media: [
              {
                status: "READY",
                media: imageUrn,
                description: {
                  text: "Image description",
                },
                title: {
                  text: "Image Title",
                },
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Post shared successfully on LinkedIn!", response.data);
  } catch (error) {
    console.error(
      "Error sharing on LinkedIn:",
      error.response ? error.response.data : error
    );
    throw new Error("Failed to share on LinkedIn.");
  }
};

app.post("/share", async (req, res) => {
  const { imageUrl, linkedinId, token } = req.body;

  try {
    const imageUrn = await uploadImageToLinkedIn(imageUrl, linkedinId, token);
    await shareOnLinkedIn(imageUrn, linkedinId, token);
    res.json({ message: "Shared successfully on LinkedIn!" });
  } catch (error) {
    console.error("Error sharing on LinkedIn:", error);
    res.status(500).send("Error sharing on LinkedIn");
  }
});
// Schedule a cron job to run every day at midnight to delete files older than 14 days
cron.schedule("0 0 * * *", () => {
  const directory = path.join(__dirname, "uploads");
  const now = Date.now();
  const fourteenDaysInMilliseconds = 14 * 24 * 60 * 60 * 1000;

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stat) => {
        if (err) throw err;

        if (now - stat.mtimeMs > fourteenDaysInMilliseconds) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
            console.log(`Deleted old file: ${file}`);
          });
        }
      });
    });
  });
});

// app.use("/profile", (req, res) => {
//   if (req.session.isAuthenticated) {
//     res.send(req.session.user);
//   } else {
//     res.status(401).send("Unauthorized");
//   }
// });
app.use("/jobs", jobsRouter);
app.use("/jobLike", jobLikeRouter);
app.use("/jobComment", jobCommentRouter);

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
