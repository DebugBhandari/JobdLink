// import necessary dependencies
import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import passport from "passport";
//import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LinkedinStrategy } from "passport-linkedin-oauth2";
import { findOrCreate } from "../services/auth.js";
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
//       clientSecret: process.env.REACT_APP_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//       proxy: true,
//     },
//     async (accessToken, refreshToken, profile, cb) => {
//       try {
//         const parsedToken = {
//           payload: {
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             picture: profile.photos[0].value,
//           },
//         };
//         const user = await findOrCreate(parsedToken);
//         cb(null, user);
//       } catch (error) {
//         cb(error, error.message);
//       }
//     }
//   )
// );

passport.use(
  new LinkedinStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: "/auth/linkedin/callback",
      scope: ["openid", "profile", "email", "w_member_social"],
      proxy: true,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const linkedinApiUrl = `https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`;

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        // Fetch user profile with picture details
        const response = await fetch(linkedinApiUrl, { headers });
        const linkedinProfile = await response.json();

        // Extract the picture from the response
        const profilePictureElements =
          linkedinProfile.profilePicture?.["displayImage~"]?.elements;
        let profilePictureUrl = "";

        // Get the highest resolution image from the elements array
        if (profilePictureElements && profilePictureElements.length > 0) {
          profilePictureUrl =
            profilePictureElements[profilePictureElements.length - 1]
              .identifiers[0].identifier;
        }

        console.log("LinkedIn ID:", linkedinProfile.id);
        console.log("Profile Picture URL:", profilePictureUrl);

        const parsedToken = {
          payload: {
            name: profile.displayName,
            email: profile.email,
            imageUrl: profilePictureUrl,
            linkedinId: profile.id,
          },
        };
        const createdFoundUser = await findOrCreate(parsedToken);
        cb(null, { createdFoundUser, accessToken });
      } catch (error) {
        cb(error, error.message);
      }
    }
  )
);
