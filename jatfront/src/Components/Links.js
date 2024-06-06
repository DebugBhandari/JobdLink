import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Link from "./Link.js";
import { useSearchStore } from "../useStore.js";

const Links = () => {
  const [jobs, setJobs] = useState([]);
  const jobSearchQuery = useSearchStore((state) => state.jobSearchQuery);

  const token = localStorage.getItem("token");
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

  React.useEffect(() => {}, []);
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
      {linkedJobs
        .filter(
          (jobToFilter) =>
            !jobToFilter.jobTitle.search(new RegExp(jobSearchQuery, "i")) ||
            !jobToFilter.company.search(new RegExp(jobSearchQuery, "i"))
        )
        .map((job) => (
          <Link key={job.id} job={job} />
        ))}
    </Box>
  );
};

export default Links;
