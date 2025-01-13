import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Job, { loadLocal } from "./Job.js";
import Box from "@mui/material/Box";
import useJLStore from "../useStore.js";
import PostJobModal from "./Modals/PostJobModal.js";
import Button from "@mui/material/Button";
//import { JLStoreContext } from "../App.js";
import Linkd from "./Linkd.js";
import Link from "@mui/material/Link";
import { style } from "./LinkView";

const Jobs = () => {
  const [jobsRefresh, setJobsRefresh] = useState(false);
  const jobSearchQuery = useJLStore((state) => state.jobSearchQuery);
  //const token = loadLocal("tokenJL");

  //const [jobs, setJobs] = useState([]);
  const zJobs = useJLStore((state) => state.zJobs);
  const localUserJobs = useJLStore((state) => state.localUserJobs);
  //const privateJobs = zJobs.filter((job) => job.private === 1);
  const setZJobs = useJLStore((state) => state.setZJobs);
  const zUser = useJLStore((state) => state.zUser);
  const local_user_id = parseInt(zUser.id);
  const setLocalUserJobs = useJLStore((state) => state.setLocalUserJobs);
  //const { contextData, setContextData } = useContext(JLStoreContext);
  //console.log("contextData", contextData);

  //For modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
    setJobsRefresh((prevState) => !prevState);
  };

  useEffect(() => {
    //setZJobs();
    setLocalUserJobs();
  }, [jobsRefresh]);

  return (
    <div className="jobsRouteDiv">
      {/* <div className="jobdLinkdAddJob">
        <div className="addButton" onClick={handleOpen}>
          Add Job
        </div>
        <Linkd zPJobs={zJobs} />
        <PostJobModal
          setJobsRefresh={setJobsRefresh}
          handleClose={handleClose}
          open={open}
        />
      </div> */}
      {localUserJobs.length !== 0 ? (
        <div className="jobdJobd">
          {localUserJobs
            .filter(
              (jobToFilter) =>
                !jobToFilter.jobTitle.search(new RegExp(jobSearchQuery, "i")) ||
                !jobToFilter.company.search(new RegExp(jobSearchQuery, "i")) ||
                !jobToFilter.name.search(new RegExp(jobSearchQuery, "i"))
            )
            .map((job) => (
              <Job
                key={job.id + local_user_id}
                job={job}
                setJobsRefresh={setJobsRefresh}
              />
            ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            marginTop: "-200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>You dont have any Jobs being tracked.</h2>

          <Link
            href="/createJob"
            variant="body"
            sx={{
              textDecoration: "none",
              fontSize: 14,
              fontWeight: "bolder",
              backgroundColor: "#2a2e45",
              width: "160px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              padding: "8px",
              color: "white",
              "&:hover": {
                backgroundColor: "white",
                color: "#2a2e45",
              },
            }}
          >
            Track Your First Job
          </Link>
        </div>
      )}
    </div>
  );
};

export default Jobs;
