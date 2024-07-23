import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import axios from "axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Comment from "./Comment";
import Avatar from "@mui/material/Avatar";
import useJLStore from "../useStore";
import { loadLocal } from "./Job";

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
  const job = getJobById(paramsId);

  const [likeCommentRefresh, setLikeCommentRefresh] = useState(false);

  //const [job, setJob] = useState();
  const isLikeInStore = zJobLikes.find((like) => like.job_id === job.id)
    ? true
    : false;
  const [userLiked, setUserLiked] = useState(isLikeInStore);
  const [userNames, setUserNames] = useState([]);
  const user_id_JSON = parseInt(zUser.id);

  const handleLikeClick = async () => {
    axios
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
      });
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
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //Empty Comments after submit
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    axios
      .post(`${baseUrl}/jobComment/`, {
        comment: data.get("commentInput"),
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
        //setLikeCommentRefresh((prevState) => !prevState);
      })
      .catch((error) => {
        console.log(error);
      });
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
  const [trigger, setTrigger] = useState(0); // State to trigger useEffect
  useEffect(() => {
    setZJobs();
    //getUsersLikes();
    setZJobComments(paramsId);
    setZJobLikesUsernames(paramsId);
    if (trigger < 2) {
      setTimeout(() => {
        setTrigger(trigger + 1);
      }, 1000); // 1 second delay for the second run
    }
  }, [trigger, likeCommentRefresh]);

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

  return (
    <Paper
      elevation={3}
      sx={{
        width: 360,
        margin: 3,
        maxHeight: "90dvh",
        padding: 2,
        borderRadius: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "column",
        ...style,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 360,
          margin: 3,
          minHeight: 340,
          borderRadius: 4,
        }}
      >
        <CardContent
          sx={{
            height: 60,
            bgcolor: "success.main",
            ...(job.status === "Rejected" && { bgcolor: "error.main" }),
            ...(job.status === "Not Applied" && {
              bgcolor: "primary.main",
            }), // Conditional styling
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            borderRadius: 4,
          }}
        >
          <Typography
            sx={{
              fontSize: 28,
            }}
            title={job.company}
          >
            {job.company.slice(0, 10) + "," + job.location}
          </Typography>
          <Typography gutterBottom sx={{ fontSize: "16px" }}>
            {job.jobTitle}
          </Typography>
        </CardContent>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "space-between",
            flexDirection: "column",
          }}
        >
          <div className="commentAvatar">
            <Avatar
              alt={job.imageUrl}
              src={job.imageUrl}
              sx={{ width: 36, height: 36 }}
            />
            <Typography
              sx={{ fontSize: "18px", fontWeight: "bold", margin: 2 }}
            >
              {job.name}
            </Typography>
          </div>
          <div className="rowDiv">
            <Typography sx={{ fontSize: "16px" }}>{job.status}</Typography>
          </div>

          <Typography
            sx={{ fontSize: "16px", height: "80px" }}
            color="text.secondary"
          >
            {job.caption}
          </Typography>
          <CardActions
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {userLiked === false ? (
              <Button
                size="small"
                onClick={handleLikeClick}
                sx={{ ...buttonHover }}
              >
                Like
              </Button>
            ) : (
              <Button
                size="small"
                onClick={handleUnlikeClick}
                sx={{ ...buttonHover }}
              >
                Unlike
              </Button>
            )}
            <Button onClick={handleMenuClick} sx={{ ...buttonHover }}>
              {job.count_likes} Likes
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
          </CardActions>
        </CardContent>
      </Paper>

      <CardContent
        component="form"
        onSubmit={handleCommentSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "left",
          alignItems: "left",
          overflow: "auto",
          width: "90%",
          height: "50%",
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
          value={newComment}
        />
        {zJobComments &&
          zJobComments.map((comment) => (
            <Comment
              key={comment.id + comment.comment + comment.user_id}
              comment={comment}
              setLikeCommentRefresh={setLikeCommentRefresh}
            />
          ))}
      </CardContent>
    </Paper>
  );
}
