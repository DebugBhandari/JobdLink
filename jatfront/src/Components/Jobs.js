import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Job, { loadLocal } from "./Job.js";
import Box from "@mui/material/Box";
import useJLStore from "../useStore.js";
import PostJobModal from "./Modals/PostJobModal.js";
import Button from "@mui/material/Button";
//import { JLStoreContext } from "../App.js";
import Linkd from "./Linkd.js";

const Jobs = () => {
  const [jobsRefresh, setJobsRefresh] = useState(false);
  const jobSearchQuery = useJLStore((state) => state.jobSearchQuery);
  //const token = loadLocal("tokenJL");

  //const [jobs, setJobs] = useState([]);
  const zJobs = useJLStore((state) => state.zJobs);
  const privateJobs = zJobs.filter((job) => job.private === 1);
  const setZJobs = useJLStore((state) => state.setZJobs);
  const zUser = useJLStore((state) => state.zUser);
  const toggleJobdLink = useJLStore((state) => state.toggleJobdLink);
  const local_user_id = parseInt(zUser.id);
  console.log("privateJobs", privateJobs);
  console.log("zJobs", zJobs);
  //const { contextData, setContextData } = useContext(JLStoreContext);
  //console.log("contextData", contextData);
  // const {
  //   zJobs,
  //   setZJobs,
  //   zJobComments,
  //   setZJobComments,
  //   zJobLikes,
  //   setZJobLikes,
  //   zUser,
  //   setZUser,
  // } = useJLStore((state) => ({
  //   zJobs: state.zJobs,
  //   setZJobs: state.setZJobs,
  //   zJobComments: state.zJobComments,
  //   setZJobComments: state.setZJobComments,
  //   zJobLikes: state.zJobLikes,
  //   setZJobLikes: state.setZJobLikes,
  //   zUser: state.zUser,
  //   setZUser: state.setZUser,
  // }));

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

  return (
    <div className="jobsRouteDiv">
      <div className="jobdLinkdAddJob">
        <div className="addButton" onClick={handleOpen}>
          Add Job
        </div>
        <Linkd zPJobs={zJobs} />
        <PostJobModal
          setJobsRefresh={setJobsRefresh}
          handleClose={handleClose}
          open={open}
        />
      </div>
      <div className="jobdJobd">
        {privateJobs
          .filter(
            (jobToFilter) =>
              !jobToFilter.jobTitle.search(new RegExp(jobSearchQuery, "i")) ||
              !jobToFilter.company.search(new RegExp(jobSearchQuery, "i")) ||
              !jobToFilter.name.search(new RegExp(jobSearchQuery, "i"))
          )
          .map(
            (job) =>
              job.user_id === local_user_id && (
                <Job
                  key={job.id + local_user_id}
                  job={job}
                  setJobsRefresh={setJobsRefresh}
                />
              )
          )}
      </div>
    </div>
  );
};

export default Jobs;
