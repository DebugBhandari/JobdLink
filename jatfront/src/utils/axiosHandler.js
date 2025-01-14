import axios from "axios";
//import { token } from "../App";
const baseUrl =
  process.env.REACT_APP_NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://jobd.link";

const token =
  JSON.parse(localStorage.getItem("JLstorage"))?.state.zUser.token || "";

export const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = "Bearer " + token;
    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => {
    console.error("Authentication failed:", error);
  }
);
