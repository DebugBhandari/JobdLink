import React, { useState, useEffect, useCallback } from "react";
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
import Comment from "../Comment";
import Avatar from "@mui/material/Avatar";

import { baseUrl } from "../../App";

export const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  "@media (min-width: 780px)": {
    width: "50%",
    top: "50%",
  },
  margin: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
};

export default function LinkModal({
  job,
  open,
  handleClose,
  handleLikeClick,
  handleUnlikeClick,
  userLiked,
  userNames,
  jobOwner,
  local_date,
  setLikeCommentRefresh,
  likeCommentRefresh,
  user_id_JSON,

  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [comments, setComments] = useState([]);
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
        setLikeCommentRefresh((prevState) => !prevState);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${baseUrl}/jobComment/${job.id}`);
        setComments(response.data);
      } catch (error) {
        console.log("Error fetching comments:", error);
      }
    };
    if (open) {
      fetchComments();
    }
  }, [job.id, open, likeCommentRefresh]);

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
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Paper
        elevation={3}
        sx={{
          width: 200,
          margin: 3,
          maxHeight: "90%",
          padding: 2,
          borderRadius: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          ...style,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
            border: "2px solid #e0e0e0",
            width: 340,
            borderRadius: 4,
          }}
        >
          <CardContent
            sx={{
              height: 60,
              bgcolor: "success.main",
              ...(job.status === "Rejected" && { bgcolor: "error.main" }),
              ...(job.status === "Not Applied" && { bgcolor: "primary.main" }), // Conditional styling
              color: "white",
              fontSize: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              borderRadius: 4,
            }}
          >
            <Typography
              sx={{
                fontSize: 40,
              }}
              title={job.company}
            >
              {job.company.slice(0, 9)}
            </Typography>
            <Typography variant="body2" color="primary.mains">
              {job.location}
            </Typography>
          </CardContent>
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
            <Typography gutterBottom sx={{ fontSize: "16px" }}>
              {job.jobTitle}
            </Typography>

            <Typography sx={{ fontSize: "16px" }}>{job.status}</Typography>
          </div>

          <Typography sx={{ fontSize: "16px" }} color="text.secondary">
            {job.caption}
          </Typography>
          <CardActions
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {userLiked === "false" ? (
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
              {userNames.map((user) => (
                <MenuItem key={user.name + "modal"} onClick={handleMenuClose}>
                  {user.name}
                </MenuItem>
              ))}
            </Menu>
          </CardActions>
        </CardContent>

        <CardContent
          component="form"
          onSubmit={handleCommentSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "left",
            maxHeight: 300,
            overflow: "auto",
            width: "90%",
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
          {comments &&
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                setLikeCommentRefresh={setLikeCommentRefresh}
              />
            ))}
        </CardContent>
      </Paper>
    </Modal>
  );
}
