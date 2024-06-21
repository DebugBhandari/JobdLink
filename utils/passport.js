// import necessary dependencies
import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreate } from "../services/auth.js";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      clientSecret: process.env.REACT_APP_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const parsedToken = {
          payload: {
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
          },
        };
        const user = await findOrCreate(parsedToken);
        cb(null, user);
      } catch (error) {
        cb(error, error.message);
      }
    }
  )
);
