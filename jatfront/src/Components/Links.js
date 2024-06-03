import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "./Link.js";
import Box from "@mui/material/Box";

const Links = () => {
  const [jobs, setJobs] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));
  const linkedJobs = jobs.filter((job) => job.private === 0);

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
  }, [token]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {linkedJobs.map((job) => (
        <Link key={job.id} job={job} />
      ))}
    </Box>
  );
};

export default Links;
