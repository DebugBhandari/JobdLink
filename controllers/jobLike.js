import pkg from "express";
const { req, res, next } = pkg;
import JobLikeService from "../services/jobLike.js";

// POST /jobLikes
export const createJobLike = async (req, res, next) => {
  try {
    const jobLike = req.body;

    console.log(req.body);

    await JobLikeService.create(jobLike);
    res.json(jobLike);
  } catch (error) {
    if (error.name === "ValidationError") {
      next(console.log("Invalid Request", error));
    } else {
      next(console.log("Internal Server Error", error));
    }
  }
};

// PUT /jobLikes/:jobLikesId
export const updateJobLike = async (req, res, next) => {
  try {
    const update = req.body;
    const jobLikeId = req.params.jobLikeId;
    const updatedJobLike = await JobLikeService.update(jobLikeId, update);
    res.json(updatedJobLike);
  } catch (error) {
    next(console.log("Joblike not found", error));
  }
};

// DELETE /jobLikes/:jobLikesId
export const deleteJobLike = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const jobId = req.params.jobId;
    await JobLikeService.deleteJobLike(jobId, userId);
    res.status(204).end();
  } catch (error) {
    next(console.log("Joblike not found", error));
  }
};

// GET /jobLikes/:jobLikesId
export const findById = async (req, res, next) => {
  try {
    res.json(await JobLikeService.findById(req.params.jobLikeId));
  } catch (error) {
    next(console.log("Joblike not found", error));
  }
};
//Get /jobLikes/:jobId
export const findByJobId = async (req, res, next) => {
  try {
    res.json(await JobLikeService.findByJobId(req.params.jobId));
  } catch (error) {
    next(console.log("Joblike not found", error));
  }
};
// GET /jobLikes
export const findAll = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    res.json(await JobLikeService.findAll(userId));
  } catch (error) {
    next(console.log("JobLike not found", error));
  }
};

//Get UserNames
export const findByUserJLJoin = async (req, res, next) => {
  try {
    res.json(await JobLikeService.findByUserJLJoin(req.params.jobId));
  } catch (error) {
    next(console.log("Joblike not found for users", error));
  }
};

//Get hasUserLikedJob
export const hasUserLikedJob = async (req, res, next) => {
  try {
    res.json(
      await JobLikeService.hasUserLikedJob(req.params.jobId, req.params.userId)
    );
  } catch (error) {
    next(console.log("Joblike not found for users", error));
  }
};
