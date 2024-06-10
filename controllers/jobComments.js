import pkg from "express";
const { req, res, next } = pkg;
import JobCommentService from "../services/jobComments.js";

// POST /jobComments
export const createJobComment = async (req, res, next) => {
  try {
    const jobComment = req.body;

    console.log(req.body);

    await JobCommentService.create(jobComment);
    res.json(jobComment);
  } catch (error) {
    if (error.name === "ValidationError") {
      next(console.log("Invalid Request", error));
    } else {
      next(console.log("Internal Server Error", error));
    }
  }
};

// PUT /jobComments/:jobCommentsId
export const updateJobComment = async (req, res, next) => {
  try {
    const update = req.body;
    const jobCommentId = req.params.jobCommentId;
    const updatedJobComment = await JobCommentService.update(
      jobCommentId,
      update
    );
    res.json(updatedJobComment);
  } catch (error) {
    next(console.log("Comment not found", error));
  }
};

// DELETE /jobComments/:jobCommentsId
export const deleteJobComment = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const jobId = req.params.jobId;
    await JobCommentService.deleteJobComment(jobId, userId);
    res.status(204).end();
  } catch (error) {
    next(console.log("Comment not found", error));
  }
};

// GET /jobComments/:jobCommentsId
export const findById = async (req, res, next) => {
  try {
    res.json(await JobCommentService.findById(req.params.jobCommentId));
  } catch (error) {
    next(console.log("Comment not found", error));
  }
};
//Get /jobComments/:jobCommentsId
export const findByJobId = async (req, res, next) => {
  try {
    res.json(await JobCommentService.findByJobId(req.params.jobId));
  } catch (error) {
    next(console.log("Comment not found", error));
  }
};

// GET /jobComments
export const findAll = async (req, res, next) => {
  try {
    res.json(await JobCommentService.findAll());
  } catch (error) {
    next(console.log("Comment not found", error));
  }
};
