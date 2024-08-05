import React, { useState, useEffect, useContext, useRef } from "react";
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
import Link from "@mui/material/Link";
import { baseUrl } from "../App";
import captureScreenshot from "../utils/LinkedinApi";

import LinkedInIcon from "@mui/icons-material/LinkedIn";
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
    setZJobById,
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
    setZJobById: state.setZJobById,
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
  console.log("userLiked", userLiked);
  //const { contextData, setContextData } = useContext(JLStoreContext);
  const user_id_JSON = parseInt(zUser.id);
  const { linkedinId, token } = zUser;
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
  const toggleHover = {
    bgcolor: "success.main",
    ...(job.status === "Rejected" && { bgcolor: "error.main" }),
    ...(job.status === "Not Applied" && {
      bgcolor: "primary.main",
    }),
    color: "white",
    "&:hover": {
      bgcolor: "white",
      color: "success.main",
      ...(job.status === "Rejected" && { color: "error.main" }),
      ...(job.status === "Not Applied" && {
        color: "primary.main",
      }),
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

  const shareToLinkedin = async (job_id) => {
    const postComment = prompt(
      `Are you sure you want to share post ${job_id} to Linkedin? Insert a linkedin caption below.`
    ); // Display an alert to get user's comment
    if (postComment) {
      setTimeout(() => {
        captureScreenshot(ref, linkedinId, token, job_id, postComment);
      }, 1000);
    }
  };

  const headerStyleConditional = { backgroundColor: "#388e3c" };
  job.status === "Rejected" &&
    (headerStyleConditional.backgroundColor = "#d32f2f");
  job.status === "Not Applied" &&
    (headerStyleConditional.backgroundColor = "#2a2e45");

  const ref = useRef();

  return (
    <div className="linkViewCard" ref={ref}>
      <div
        className="linkViewCardHeader"
        onClick={() => {
          window.location.href = `/userProfile/${job.user_id}`;
        }}
      >
        {" "}
        {job.user_id === user_id_JSON ? (
          <Button
            onClick={() => {
              toggleJobdLink(job.id);
              setZJobs();
            }}
            data-html2canvas-ignore
            sx={{
              fontWeight: 800,
              position: "absolute",
              borderRadius: 20,

              height: "30px",
              fontSize: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              bgcolor: "success.main",
              ...(job.status === "Rejected" && { bgcolor: "error.main" }),
              ...(job.status === "Not Applied" && {
                bgcolor: "primary.main",
              }),

              top: 0,
              right: 0,
              ...toggleHover,
            }}
          >
            Unlink
          </Button>
        ) : null}
        <div className="avatarDiv">
          <Avatar
            alt={job.imageUrl}
            src={job.imageUrl}
            sx={{ width: 44, height: 44 }}
          />
          <div className="profileAvatarDiv">
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
                padding: 0,
              }}
            >
              {job.name}
            </Typography>
            <p className="profileAvatarTitle" style={{ fontSize: "14px" }}>
              {job.email}
            </p>
          </div>
        </div>{" "}
      </div>
      <div
        style={{
          width: "100%",
          height: "6px",
          ...headerStyleConditional,
        }}
      ></div>
      <div
        className="linkViewCardContent"
        onClick={() => {
          window.location.href = `/links/${job.id}`;
        }}
      >
        <h2 className="cardHeaderTitle" title={job.company}>
          {job.jobTitle}
        </h2>
        <h4 className="cardHeaderSubTitle">
          {" "}
          {job?.company.slice(0, 22) + ", " + job.location}
        </h4>

        <div className="rowDiv">
          <h1 className="headerNormalText">{job.status}</h1>
          <h1 className="headerNormalText">{job.created_at.slice(0, 10)}</h1>
        </div>

        <h1 className="headerGreyText">{job.caption}</h1>
      </div>
      <div className="cardActions">
        <Link
          href={`/links/${job.id}`}
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
          <Button sx={{ fontSize: "12px", width: "120px", ...buttonHover }}>
            {job.count_comments} Comments
          </Button>
        </Link>

        <Button
          onClick={handleMenuClick}
          sx={{ fontSize: "12px", width: "120px", ...buttonHover }}
        >
          {job.count_likes} Likes
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
      <div className="cardActions">
        {userLiked === false ? (
          <Button
            size="small"
            onClick={() => handleLikeClick()}
            sx={{
              fontSize: "12px",
              width: "100px",
              textTransform: "none",
              ...buttonHover,
            }}
          >
            <ThumbUpOffAltIcon sx={{ fontSize: "20px", marginRight: "4px" }} />{" "}
            Like {/* Likeeee */}
          </Button>
        ) : (
          <Button
            size="small"
            onClick={() => handleUnlikeClick()}
            sx={{
              fontSize: "12px",
              width: "100px",
              textTransform: "none",
              ...buttonHover,
            }}
          >
            <ThumbUpAltIcon sx={{ fontSize: "20px", marginRight: "4px" }} />{" "}
            Unlike
            {/* Unlikeeee */}
          </Button>
        )}
        <Button
          size="small"
          data-html2canvas-ignore
          onClick={() => shareToLinkedin(job.id)}
          sx={{
            fontSize: "14px",
            textTransform: "none",
            ...buttonHover,
          }}
        >
          <LinkedInIcon sx={{ fontSize: "20px", marginRight: "4px" }} /> Share
        </Button>{" "}
        <Link
          href={`/links/${job.id}`}
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
          <Button
            size="small"
            sx={{
              fontSize: "12px",
              width: "100px",
              textTransform: "none",
              ...buttonHover,
            }}
          >
            <CommentIcon sx={{ fontSize: "20px", marginRight: "4px" }} />{" "}
            Comment
          </Button>
        </Link>
      </div>
    </div>
  );
}
