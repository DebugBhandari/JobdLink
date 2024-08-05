import pkg from "express";
const { req, res, next } = pkg;
import ProfileService from "../services/profile.js";

// POST /profiles
export const createProfile = async (req, res, next) => {
  try {
    const profile = req.body;

    console.log(req.body);

    await ProfileService.create(profile);
    res.json(profile);
  } catch (error) {
    if (error.name === "ValidationError") {
      next(console.log("Invalid Request", error));
    } else {
      next(console.log("Internal Server Error", error));
    }
  }
};

// PUT /profiles/:profileId
export const updateProfile = async (req, res, next) => {
  try {
    const update = req.body;
    const profileId = req.params.profileId;
    const updatedProfile = await ProfileService.update(profileId, update);
    res.json(updatedProfile);
  } catch (error) {
    next(console.log("Profile not found", error));
  }
};

// DELETE /profiles/:profileId
export const deleteProfile = async (req, res, next) => {
  try {
    await ProfileService.deleteProfile(req.params.profileId);
    res.status(204).end();
  } catch (error) {
    next(console.log("Profile not found", error));
  }
};

// GET /profiles/:profileId
export const findProfileByUserId = async (req, res, next) => {
  try {
    res.json(await ProfileService.findProfileByUserId(req.params.profileId));
  } catch (error) {
    next(console.log("Profile not found", error));
  }
};
export const toggleProfilePartial = async (req, res, next) => {
  try {
    const user_id = req.params.userId;
    const updatedProfile = await ProfileService.toggleProfilePartial(user_id);
    res.json(updatedProfile);
  } catch (error) {
    next(console.log("Profile not found", error));
  }
};
