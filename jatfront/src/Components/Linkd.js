import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import OneLink from "./OneLink.js";
import useJLStore from "../useStore.js";
//import { JLStoreContext } from "../App";
import Profile from "./Profile.js";
import { loadLocal } from "./Job.js";
import { useLocation } from "react-router-dom";
import { baseUrl } from "../App";

const Linkd = ({ zPJobs }) => {
  //const [jobs, setJobs] = useState([]);
  const jobSearchQuery = useJLStore((state) => state.jobSearchQuery);

  //const { contextData, setContextData } = useContext(JLStoreContext);

  const {
    zJobs,
    setZJobs,
    zJobComments,
    setZJobComments,
    zJobLikes,
    setZJobLikes,
    zUser,
    setZUser,
  } = useJLStore((state) => ({
    zJobs: state.zJobs,
    setZJobs: state.setZJobs,
    zJobComments: state.zJobComments,
    setZJobComments: state.setZJobComments,
    zJobLikes: state.zJobLikes,
    setZJobLikes: state.setZJobLikes,
    zUser: state.zUser,
    setZUser: state.setZUser,
  }));

  const location = useLocation();
  const params = location.pathname;
  //const [user, setUser] = useState(zUser);
  //console.log("user", user);
  const [linkView, setLinkView] = useState(false);

  const token = zUser.token;

  const local_user_id = parseInt(zUser.id);

  const [likeCommentRefresh, setLikeCommentRefresh] = useState(false);
  const getUsersLikes = async () => {
    try {
      const response = await axios.get(`${baseUrl}/jobLike/${local_user_id}`);
      setZJobLikes(response.data);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };
  const linkedJobs = zJobs.filter(
    (job) => job.private === 0 && job.user_id === local_user_id
  );

  //console.log("linkedJobs", linkedJobs);
  //setZJobs(jobs);
  // console.log("zJobs", JSON.parse(zJobs || []));

  return (
    <div className="sideLinks">
      <div className="sideLinksContent">
        {linkedJobs
          .filter(
            (jobToFilter) =>
              !jobToFilter.jobTitle.search(new RegExp(jobSearchQuery, "i")) ||
              !jobToFilter.company.search(new RegExp(jobSearchQuery, "i"))
          )
          .map((job) => (
            <OneLink
              key={job.id}
              job={job}
              likeCommentRefresh={likeCommentRefresh}
              setLikeCommentRefresh={setLikeCommentRefresh}
              fromJobd={true}
            />
          ))}
      </div>
    </div>
  );
};

export default Linkd;
