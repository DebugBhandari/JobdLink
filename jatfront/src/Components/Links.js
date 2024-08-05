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

const Links = () => {
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
    setZProfile,
  } = useJLStore((state) => ({
    zJobs: state.zJobs,
    setZJobs: state.setZJobs,
    zJobComments: state.zJobComments,
    setZJobComments: state.setZJobComments,
    zJobLikes: state.zJobLikes,
    setZJobLikes: state.setZJobLikes,
    zUser: state.zUser,
    setZUser: state.setZUser,
    setZProfile: state.setZProfile,
  }));
  //const [user, setUser] = useState(zUser);
  //console.log("user", user);
  const [linkView, setLinkView] = useState(false);

  const token = zUser.token;

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
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    const name = urlParams.get("name");
    const email = urlParams.get("email");
    const imageUrl = urlParams.get("imageUrl");
    const id = parseInt(urlParams.get("id"));
    const linkedinId = urlParams.get("linkedinId");
    const loggedUser = { id, name, email, imageUrl, linkedinId, token };

    if (token) {
      // localStorage.setItem("tokenJL", token);
      // localStorage.setItem("nameJL", name);
      // localStorage.setItem("emailJL", email);
      // localStorage.setItem("imageUrlJL", imageUrl);
      // localStorage.setItem("idJL", id);
      // localStorage.setItem("linkedinIdJL", linkedinId);

      setZUser(loggedUser);
      setZProfile(loggedUser.id);
      window.location.href = "/";
    }

    setZJobs();
    getUsersLikes();
  }, [token, likeCommentRefresh]);

  const linkedJobs = zJobs.filter((job) => job.private === 0);

  //console.log("linkedJobs", linkedJobs);
  //setZJobs(jobs);
  // console.log("zJobs", JSON.parse(zJobs || []));

  return (
    <div className="linksRouteDiv">
      {/* <div className="linkdProfile">
        <Profile handleOpen={null} />
      </div> */}
      <div className="linkdLinkd">
        {linkedJobs
          .filter(
            (jobToFilter) =>
              !jobToFilter.jobTitle.search(new RegExp(jobSearchQuery, "i")) ||
              !jobToFilter.company.search(new RegExp(jobSearchQuery, "i")) ||
              !jobToFilter.name.search(new RegExp(jobSearchQuery, "i"))
          )
          .map((job) => (
            <OneLink
              key={job.id}
              job={job}
              likeCommentRefresh={likeCommentRefresh}
              setLikeCommentRefresh={setLikeCommentRefresh}
              fromJobd={false}
            />
          ))}
      </div>
    </div>
  );
};

export default Links;
