import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import OneLink from "./OneLink.js";
import useJLStore from "../useStore.js";
//import { JLStoreContext } from "../App";
import Profile from "./Profile.js";
import LinkView from "./LinkView.js";
import { loadLocal } from "./Job.js";
import { baseUrl } from "../App";

import { useLocation } from "react-router-dom";
import { set } from "react-hook-form";
const DashBoard = () => {
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
    // setZGuestProfile,
    //setActiveProfile,
    setLocalUserJobs,
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
    // setZGuestProfile: state.setZGuestProfile,
    //setActiveProfile,
    setLocalUserJobs: state.setLocalUserJobs,
  }));
  //const [user, setUser] = useState(zUser);
  //console.log("user", user);
  const [linkView, setLinkView] = useState(false);

  const token = zUser.token;

  const locationPath = useLocation();
  const paramsId = parseInt(locationPath.pathname.split("/")[2]);
  const [partialToggle, setPartialToggle] = useState(false);

  const user_id_JSON = parseInt(zUser.id);

  const [likeCommentRefresh, setLikeCommentRefresh] = useState(false);
  const getUsersLikes = async () => {
    try {
      const response = await axios.get(`${baseUrl}/jobLike/${user_id_JSON}`);
      setZJobLikes(response.data);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  useEffect(() => {
    setZJobs();
    getUsersLikes();

    setLocalUserJobs(paramsId);
  }, [token, likeCommentRefresh, partialToggle]);

  const linkedJobs = zJobs.filter(
    (job) => job.private === 0 && job.user_id === paramsId
  );

  //console.log("linkedJobs", linkedJobs);
  //setZJobs(jobs);
  // console.log("zJobs", JSON.parse(zJobs || []));

  return (
    <div className="linksRouteDiv">
      <div className="linkdProfile">
        <Profile
          partialToggle={partialToggle}
          setPartialToggle={setPartialToggle}
        />
      </div>
      <div className="linkdLinkd" style={{ marginTop: 0 }}>
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

export default DashBoard;
