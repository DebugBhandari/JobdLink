import React, { useState, useEffect, useContext } from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import axios from "axios";
import LinkModal from "./Modals/LinkModal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { loadLocal } from "./Job";
import useJLStore from "../useStore";
import { Link } from "react-router-dom";
import { baseUrl } from "../App";
//import { JLStoreContext } from "../App";

import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

import CommentIcon from "@mui/icons-material/Comment";

export default function OneLink({
  job,
  likeCommentRefresh,
  setLikeCommentRefresh,
  fromJobd,
}) {
  //const [job, setJob] = useState(mappedJob);
  const [userNames, setUserNames] = useState([]);
  //const zUser = useJLStore((state) => state.zUser);

  //const created_at = new Date(job.created_at);

  //const locale_date = created_at.toLocaleDateString();
  //const nameJL = loadLocal("nameJL");
  //const navigate = useNavigate();
  const {
    zJobs,
    setZJobs,
    zJobComments,
    setZJobComments,
    zJobLikes,
    setZJobLikes,
    zUser,
    setZUser,
    addZJobLike,
    removeZJobLike,
    zJobLikesUsernames,
    setZJobLikesUsernames,
    toggleJobdLink,
  } = useJLStore((state) => ({
    zJobs: state.zJobs,
    setZJobs: state.setZJobs,
    zJobComments: state.zJobComments,
    setZJobComments: state.setZJobComments,
    zJobLikes: state.zJobLikes,
    setZJobLikes: state.setZJobLikes,
    zUser: state.zUser,
    setZUser: state.setZUser,
    addZJobLike: state.addZJobLike,
    removeZJobLike: state.removeZJobLike,
    zJobLikesUsernames: state.zJobLikesUsernames,
    setZJobLikesUsernames: state.setZJobLikesUsernames,
    toggleJobdLink: state.toggleJobdLink,
  }));
  const isLikeInStore = zJobLikes.find((like) => like.job_id === job.id)
    ? true
    : false;
  const [userLiked, setUserLiked] = useState(isLikeInStore);
  //const { contextData, setContextData } = useContext(JLStoreContext);
  const user_id_JSON = parseInt(zUser.id);
  const buttonHover = {
    "&:hover": {
      bgcolor: "success.main",
      ...(job.status === "Rejected" && { bgcolor: "error.main" }),
      ...(job.status === "Not Applied" && {
        bgcolor: "primary.main",
      }),
      color: "white",
    },
  };

  const invisibleStyle = {
    display: "none",
  };
  zJobLikesUsernames.length > 0 && (invisibleStyle.display = "block");

  //For Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setZJobLikesUsernames(job.id);
    if (job.count_likes > 0) {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLikeClick = async () => {
    user_id_JSON
      ? axios
          .post(`${baseUrl}/jobLike`, {
            job_id: job.id,
            user_id: user_id_JSON,
          })
          .then((response) => {
            console.log("Liked", response.data);
            setUserLiked(true);
            addZJobLike({ job_id: job.id, user_id: user_id_JSON });
            setLikeCommentRefresh((prevState) => !prevState);
          })
      : alert("Please login to like");
  };
  const handleUnlikeClick = async () => {
    axios
      .delete(`${baseUrl}/jobLike/${job.id}/${user_id_JSON}`)
      .then((response) => {
        console.log("Unliked");
        setUserLiked(false);
        removeZJobLike(job.id);
        setLikeCommentRefresh((prevState) => !prevState);
        setZJobLikesUsernames(job.id);
      });
  };
  const headerStyleConditional = { backgroundColor: "#388e3c" };
  job.status === "Rejected" &&
    (headerStyleConditional.backgroundColor = "#d32f2f");
  job.status === "Not Applied" &&
    (headerStyleConditional.backgroundColor = "#2a2e45");

  return (
    <div className="linkViewCard">
      <div className="linkViewCardHeader">
        <h2 className="cardHeaderTitle" title={job.company}>
          {job.jobTitle}
        </h2>
        <h2 className="cardHeaderSubTitle">
          {" "}
          {job.company.slice(0, 22) + "," + job.location}
        </h2>
      </div>
      <div
        style={{
          width: "100%",
          height: "10px",
          ...headerStyleConditional,
        }}
      ></div>
      <div className="linkViewCardContent">
        <div className="avatarDiv">
          <Avatar
            alt={job.imageUrl}
            src={job.imageUrl}
            sx={{ width: 36, height: 36 }}
          />
          <h1 className="avatarTitle">{job.name}</h1>
        </div>
        <div className="rowDiv">
          <h1 className="headerNormalText">{job.status}</h1>
        </div>

        <h1 className="headerGreyText">{job.caption}</h1>
      </div>
      <div className="cardActions">
        <Link
          to={`/links/${job.id}`}
          variant="body"
          style={{
            textDecoration: "none",
            fontSize: 24,
            zIndex: 5,
            fontWeight: "bolder",
            borderRadius: 10,
            maxHeight: 50,
            padding: 5,
            color: "#ff00009b",
          }}
        >
          <Button sx={{ ...buttonHover }}>
            {job.count_comments} <CommentIcon />
          </Button>
        </Link>

        <Button onClick={handleMenuClick} sx={{ ...buttonHover }}>
          {job.count_likes} <ThumbUpAltIcon sx={{ marginBottom: "4px" }} />
        </Button>
        {zJobLikesUsernames ? (
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {zJobLikesUsernames.map((user) => (
              <MenuItem key={user.username + "like"} onClick={handleMenuClose}>
                {user.name}
              </MenuItem>
            ))}
          </Menu>
        ) : null}
      </div>
      {!fromJobd === true ? (
        <div className="centreDiv">
          {" "}
          <div className="cardActions">
            {userLiked === false ? (
              <Button
                size="small"
                onClick={() => handleLikeClick()}
                sx={{
                  fontSize: "16px",
                  ...buttonHover,
                }}
              >
                <ThumbUpOffAltIcon /> {/* Likeeee */}
              </Button>
            ) : (
              <Button
                size="small"
                onClick={() => handleUnlikeClick()}
                sx={{
                  fontSize: "16px",
                  ...buttonHover,
                }}
              >
                <ThumbUpAltIcon /> {/* Unlikeeee */}
              </Button>
            )}
          </div>{" "}
        </div>
      ) : (
        <div className="centreDiv">
          {" "}
          <div className="cardActions">
            <Button
              size="small"
              onClick={() => {
                toggleJobdLink(job.id);
                setZJobs();
              }}
              sx={{ color: "#d32f2f", fontWeight: 800, ...buttonHover }}
            >
              Jobd
            </Button>{" "}
          </div>
        </div>
      )}
    </div>
  );
}
