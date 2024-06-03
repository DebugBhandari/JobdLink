import pkg from "express";
const { req, res, next } = pkg;
import JobService from "../services/job.js";

// POST /jobs
export const createJob = async (req, res, next) => {
  try {
    const job = req.body;

    console.log(req.body);

    await JobService.create(job);
    res.json(job);
  } catch (error) {
    if (error.name === "ValidationError") {
      next(console.log("Invalid Request", error));
    } else {
      next(console.log("Internal Server Error", error));
    }
  }
};

// PUT /jobs/:jobId
export const updateJob = async (req, res, next) => {
  try {
    const update = req.body;
    const jobId = req.params.jobId;
    const updatedJob = await JobService.update(jobId, update);
    res.json(updatedJob);
  } catch (error) {
    next(console.log("Job not found", error));
  }
};

// DELETE /jobs/:jobId
export const deleteJob = async (req, res, next) => {
  try {
    await JobService.deleteJob(req.params.jobId);
    res.status(204).end();
  } catch (error) {
    next(console.log("Job not found", error));
  }
};

// GET /jobs/:jobId
export const findById = async (req, res, next) => {
  try {
    res.json(await JobService.findById(req.params.jobId));
  } catch (error) {
    next(console.log("Job not found", error));
  }
};

// GET /jobs
export const findAll = async (req, res, next) => {
  try {
    res.json(await JobService.findAll());
  } catch (error) {
    next(console.log("Jobs not found", error));
  }
};
