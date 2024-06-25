import React, { useEffect, useState } from "react";
import axios from "axios";
import Job from "./Job.js";
import Box from "@mui/material/Box";
import { useSearchStore } from "../useStore.js";
import PostJobModal from "./Modals/PostJobModal.js";
import Button from "@mui/material/Button";
import Profile from "./Profile.js";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [jobsRefresh, setJobsRefresh] = useState(false);
  const jobSearchQuery = useSearchStore((state) => state.jobSearchQuery);
  const token = localStorage.getItem("tokenJL");
  console.log("Jobs", jobs);

  //For modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

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
  }, [jobsRefresh, token]);

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
        <Profile handleOpen={handleOpen} />
      </Box>
      <PostJobModal
        setJobsRefresh={setJobsRefresh}
        handleClose={handleClose}
        open={open}
      />
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
        {jobs
          .filter(
            (jobToFilter) =>
              !jobToFilter.jobTitle.search(new RegExp(jobSearchQuery, "i")) ||
              !jobToFilter.company.search(new RegExp(jobSearchQuery, "i"))
          )
          .map(
            (job) =>
              job.user_id === JSON.parse(localStorage.getItem("idJL")) && (
                <Job key={job.id} job={job} setJobsRefresh={setJobsRefresh} />
              )
          )}
      </Box>
    </Box>
  );
};

export default Jobs;
