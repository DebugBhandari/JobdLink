// // import necessary dependencies
// import express from "express";
// import dotenv from "dotenv";
// dotenv.config({ path: ".env.local" });
// import passport from "passport";
// //import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { Strategy as LinkedinStrategy } from "passport-linkedin-oauth2";
// import { findOrCreate } from "../services/auth.js";
// import { storeTokens } from "../services/token.js";

// const inferredExpiresIn = 5184000; // 60 days in seconds

// passport.use(
//   new LinkedinStrategy(
//     {
//       clientID: process.env.LINKEDIN_CLIENT_ID,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//       callbackURL: "/auth/linkedin/callback",
//       grantType: "authorization_code",
//       scope: [
//         "openid",
//         "profile",
//         "email",
//         "w_member_social",
//         "offline_access",
//       ],
//       proxy: true,
//     },
//     async (accessToken, refreshToken, profile, cb) => {
//       try {
//         const parsedToken = {
//           payload: {
//             name: profile.displayName,
//             email: profile.email,
//             imageUrl: profile.picture,
//             linkedinId: profile.id,
//           },
//         };

//         const createdFoundUser = await findOrCreate(parsedToken);

//         // Save tokens and inferred expiration in your database
//         console.log(
//           "AT",
//           accessToken,
//           "RT",
//           refreshToken,
//           "ID",
//           createdFoundUser.id,
//           "EX",
//           inferredExpiresIn
//         );
//         await storeTokens(
//           createdFoundUser.id,
//           accessToken,
//           refreshToken,
//           inferredExpiresIn
//         );

//         cb(null, { createdFoundUser, accessToken });
//       } catch (error) {
//         cb(error, error.message);
//       }
//     }
//   )
// );
