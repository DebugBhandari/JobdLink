import React, { useState, useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import axios from "axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Comment from "./Comment";
import Avatar from "@mui/material/Avatar";
import useJLStore from "../useStore";
import { loadLocal } from "./Job";
import html2canvas from "html2canvas";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CommentIcon from "@mui/icons-material/Comment";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import { useSearchParams, useLocation } from "react-router-dom";
import { baseUrl } from "../App";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "80dvh",
  "@media (min-width: 780px)": {
    width: "50%",
    top: "50%",
  },
  margin: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
};

export default function LinkView() {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const {
    zJob,
    setJobById,
    zJobs,
    setZJobs,
    getJobById,
    zUser,
    setZJobComments,
    zJobComments,
    addZJobComment,
    zJobLikes,
    setZJobLikes,
    addZJobLike,
    removeZJobLike,
    zJobLikesUsernames,
    setZJobLikesUsernames,
  } = useJLStore((state) => ({
    zJob: state.zJob,
    setJobById: state.setJobById,
    zJobs: state.zJobs,
    setZJobs: state.setZJobs,
    getJobById: state.getJobById,
    zUser: state.zUser,
    setZJobComments: state.setZJobComments,
    zJobComments: state.zJobComments,
    addZJobComment: state.addZJobComment,
    zJobLikes: state.zJobLikes,
    setZJobLikes: state.setZJobLikes,
    addZJobLike: state.addZJobLike,
    removeZJobLike: state.removeZJobLike,
    zJobLikesUsernames: state.zJobLikesUsernames,
    setZJobLikesUsernames: state.setZJobLikesUsernames,
  }));

  const location = useLocation();
  const paramsId = parseInt(location.pathname.split("/")[2]);

  const [likeCommentRefresh, setLikeCommentRefresh] = useState(false);

  const [job, setJob] = useState(zJob);
  const isLikeInStore = zJobLikes.find((like) => like.job_id === job.id)
    ? true
    : false;
  const [userLiked, setUserLiked] = useState(isLikeInStore);
  const [userNames, setUserNames] = useState([]);
  const user_id_JSON = parseInt(zUser.id);
  const { linkedinId, token } = zUser;

  const handleLikeClick = async () => {
    user_id_JSON
      ? axios
          .post(`${baseUrl}/jobLike`, {
            job_id: job.id,
            user_id: user_id_JSON,
          })
          .then((response) => {
            console.log("Liked", response.data);
            setUserLiked((prevState) => !prevState);
            addZJobLike({ job_id: job.id, user_id: user_id_JSON });
            setLikeCommentRefresh((prevState) => !prevState);
            setZJobs();
            setZJobLikesUsernames(job.id);
          })
      : alert("Please login to like the job.");
  };
  const handleUnlikeClick = async () => {
    axios
      .delete(`${baseUrl}/jobLike/${job.id}/${user_id_JSON}`)
      .then((response) => {
        console.log("Unliked");
        setUserLiked((prevState) => !prevState);
        removeZJobLike(job.id);
        setLikeCommentRefresh((prevState) => !prevState);
        setZJobs();
        setZJobLikesUsernames(job.id);
      });
  };

  //   const hasUserLiked = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3001/jobLike/${job.id}/${user_id_JSON}/bool`
  //       );
  //       setUserLiked(response.data);
  //     } catch (error) {
  //       console.error("Error fetching likes:", error);
  //     }
  //   };

  //Likes Menu
  const handleMenuClick = (event) => {
    setZJobLikesUsernames(job.id);
    if (job.count_likes > 0) {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //Empty Comments after submit
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    user_id_JSON
      ? axios
          .post(`${baseUrl}/jobComment/`, {
            comment: newComment,
            job_id: job.id,
            user_id: user_id_JSON,
          })
          .then((response) => {
            console.log(response.data);
            console.log("Commented successfully");
            setNewComment("");
            addZJobComment({
              comment: response.data.comment,
              email: zUser.email,
              imageUrl: zUser.imageUrl,
              name: zUser.name,
              commentedAt: new Date(),
            });
            setLikeCommentRefresh((prevState) => !prevState);
          })
          .catch((error) => {
            console.log(error);
          })
      : alert("Please login to comment.");
  };

  //   const getUsersLikes = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3001/jobLike/${user_id_JSON}`
  //       );
  //       setZJobLikes(response.data);
  //     } catch (error) {
  //       console.error("Error fetching likes:", error);
  //     }
  //   };

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

  const ref = useRef();

  const captureScreenshot = async () => {
    const canvas = await html2canvas(ref.current, {
      width: window.scrollWidth,
      height: window.scrollHeight,
      backgroundColor: "white", // Ensure background is transparent
      useCORS: true, // Handle cross-origin images
      logging: true, // Enable logging for debugging
      scale: 2, // Scale the image up by 2x
    });
    const imgData = canvas.toDataURL("image/png");

    // Convert the base64 string to a file
    const blob = await fetch(imgData).then((res) => res.blob());
    const file = new File([blob], "screenshot.png", { type: "image/png" });

    // Upload the file
    uploadScreenshot(file);
  };

  const uploadScreenshot = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${baseUrl}/upload`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log("Screenshot uploaded:", result.url);
      shareOnLinkedIn(result.url);
    } catch (error) {
      console.error("Error uploading screenshot:", error);
    }
  };

  const shareOnLinkedIn = async (imageUrl) => {
    try {
      const response = await fetch(`${baseUrl}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl, linkedinId, token, job_id: job.id }),
      });
      const result = await response.json();
      alert("Shared on LinkedIn!");
      console.log("Shared on LinkedIn:", result);
    } catch (error) {
      console.error("Error sharing on LinkedIn:", error);
    }
  };

  useEffect(() => {
    setZJobs();
    //getUsersLikes();
    setJobById(paramsId);
    setZJobComments(paramsId);
    setZJobLikesUsernames(paramsId);
  }, [likeCommentRefresh]);

  const headerStyleConditional = { backgroundColor: "#388e3c" };
  job.status === "Rejected" &&
    (headerStyleConditional.backgroundColor = "#d32f2f");
  job.status === "Not Applied" &&
    (headerStyleConditional.backgroundColor = "#2a2e45");

  return (
    <div className="linkView">
      <div className="linkViewSections">
        <div className="linkViewCard" ref={ref}>
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
          {zUser.id === job.user_id ? (
            <div className="cardActions">
              <Button onClick={handleMenuClick} sx={{ ...buttonHover }}>
                {job.count_likes}{" "}
                <ThumbUpAltIcon sx={{ marginBottom: "4px" }} />
              </Button>
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
                  <MenuItem key={user.name + "modal"} onClick={handleMenuClose}>
                    {user.name}
                  </MenuItem>
                ))}
              </Menu>
              <Button
                size="small"
                onClick={() => captureScreenshot()}
                sx={{
                  fontSize: "14px",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                  },
                }}
              >
                <LinkedInIcon />
              </Button>{" "}
              <Button sx={{ ...buttonHover }}>
                {job.count_comments} <CommentIcon />
              </Button>
            </div>
          ) : (
            <div className="cardActions">
              {userLiked === false ? (
                <Button
                  size="small"
                  onClick={handleLikeClick}
                  sx={{ ...buttonHover }}
                >
                  <ThumbUpOffAltIcon />
                </Button>
              ) : (
                <Button
                  size="small"
                  onClick={handleUnlikeClick}
                  sx={{ ...buttonHover }}
                >
                  <ThumbUpAltIcon />
                </Button>
              )}
              <Button onClick={handleMenuClick} sx={{ ...buttonHover }}>
                {job.count_likes}{" "}
                <ThumbUpAltIcon sx={{ marginBottom: "4px" }} />
              </Button>
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
                  <MenuItem key={user.name + "modal"} onClick={handleMenuClose}>
                    {user.name}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          )}
        </div>
      </div>
      <div className="linkViewSections">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "left",
            overflow: "auto",
            width: "100%",
            height: "100%",
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="commentInput"
            label="Comment"
            name="commentInput"
            autoComplete="Comment"
            autoFocus
            size="small"
            onChange={(e) => setNewComment(e.target.value)}
            onSubmit={handleCommentSubmit}
            value={newComment}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleCommentSubmit(e);
              }
            }}
          />
          {zJobComments &&
            zJobComments.map((comment) => (
              <Comment
                key={
                  Math.floor(Math.random() * 10000) +
                  Math.floor(Math.random() * 10000) +
                  comment.comment +
                  Math.floor(Math.random() * 10000)
                }
                comment={comment}
                setLikeCommentRefresh={setLikeCommentRefresh}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
