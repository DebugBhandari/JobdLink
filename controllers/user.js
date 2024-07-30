import pkg from "express";
const { req, res, next } = pkg;
import UserService from "../services/user.js";

export const findUserById = async (req, res, next) => {
  try {
    res.json(await UserService.findById(req.params.userId));
  } catch (error) {
    next(console.log("User not found", error));
  }
};
