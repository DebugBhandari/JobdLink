import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Link from "./Link.js";
import { useSearchStore } from "../useStore.js";
import { AuthContext } from "../App";
import Profile from "./Profile.js";

const Links = () => {
  const [jobs, setJobs] = useState([]);
  const jobSearchQuery = useSearchStore((state) => state.jobSearchQuery);
  const { setAuthData } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("tokenJL");
  const linkedJobs = jobs.filter((job) => job.private === 0);

  const [likeCommentRefresh, setLikeCommentRefresh] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const name = urlParams.get("name");
    const email = urlParams.get("email");
    const imageUrl = urlParams.get("imageUrl");
    const id = urlParams.get("id");
    const user = { id, name, email, imageUrl };
    setUser(user);
    setAuthData(user);

    if (token) {
      localStorage.setItem("tokenJL", token);
      localStorage.setItem("nameJL", name);
      localStorage.setItem("emailJL", email);
      localStorage.setItem("imageUrlJL", imageUrl);
      localStorage.setItem("idJL", id);
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:3001/jobs/", {
          "content-type": "application/json",
          headers: { Authorization: "Bearer " + token },
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        console.error("Token:", token);
      }
    };

    fetchJobs();
  }, [likeCommentRefresh]);

  React.useEffect(() => {}, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        "@media (min-width: 780px)": {
          flexDirection: "row",
        },
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "20vh",
          "@media (min-width: 780px)": {
            height: "80vh",
          },
          width: "30%",
          marginTop: 8,
        }}
      >
        <Profile handleOpen={null} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          width: "68%",
          marginTop: 16,
        }}
      >
        {linkedJobs
          .filter(
            (jobToFilter) =>
              !jobToFilter.jobTitle.search(new RegExp(jobSearchQuery, "i")) ||
              !jobToFilter.company.search(new RegExp(jobSearchQuery, "i"))
          )
          .map((job) => (
            <Link
              key={job.id}
              job={job}
              setLikeCommentRefresh={setLikeCommentRefresh}
              likeCommentRefresh={likeCommentRefresh}
            />
          ))}
      </Box>
    </Box>
  );
};

export default Links;
