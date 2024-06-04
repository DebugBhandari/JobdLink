import React, { useEffect, useState } from "react";
import axios from "axios";
import Job from "./Job.js";
import Box from "@mui/material/Box";
import PostJob from "./PostJob.js";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem("token");
  const [jobsRefresh, setJobsRefresh] = useState(false);

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
        
      }
    };
    fetchJobs();
  }, [jobsRefresh]);
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
      <PostJob setJobsRefresh={setJobsRefresh} />
      {jobs.map(
        (job?) =>
          job.user_id === JSON.parse(localStorage.getItem("user_id")) && (
            <Job key={job.id} job={job} setJobsRefresh={setJobsRefresh} />
          )
      )}
    </Box>
  );
};

export default Jobs;
