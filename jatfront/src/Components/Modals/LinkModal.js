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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  minHeight: "70%",
  maxHeight: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
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

  user_id_JSON,

  ...props
}) {
  // //For Like Modal
  // const [openLike, setOpenLike] = useState(false);
  // const handleOpenLike = () => {
  //   setOpenLike(true);
  // };
  // const handleCloseLike = () => {
  //   setOpenLike(false);
  // };
  // console.log("userNames", userNames);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const [comments, setComments] = useState([]);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    axios
      .post(`http://localhost:3001/jobComment/`, {
        comment: data.get("commentInput"),
        job_id: job.id,
        user_id: user_id_JSON,
      })
      .then((response) => {
        console.log(response.data);
        console.log("Commented successfully");
        data.set("commentInput", "");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/jobComment/${job.id}`
        );
        setComments(response.data);
      } catch (error) {
        console.log("Error fetching comments:", error);
      }
    };
    if (open) {
      fetchComments();
    }
  }, [job.id, open]);

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
          minWidth: 345,
          margin: 3,
          border: "2px solid #000",
          minHeight: 300,
          ...style,
        }}
      >
        {/* <LikeModal
          usernames={userNames}
          openLike={openLike}
          handleCloseLike={handleCloseLike}
        /> */}
        <CardContent
          sx={{
            height: 80,
            bgcolor: "success.main",
            ...(job.status === "Rejected" && { bgcolor: "error.main" }),
            ...(job.status === "Not Applied" && { bgcolor: "primary.main" }), // Conditional styling
            color: "white",
            fontSize: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
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
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "left",

            border: "2px solid #000",
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {jobOwner && jobOwner.username}
          </Typography>
          <Typography gutterBottom variant="h5">
            {job.jobTitle}
          </Typography>

          <Typography variant="h5" color="primary.">
            {job.status}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            {job.jobUrl}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            {job.caption}
          </Typography>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
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
            {userNames.length} Likes
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
              <MenuItem key={user.username + "modal"} onClick={handleMenuClose}>
                {user.username}
              </MenuItem>
            ))}
          </Menu>
        </CardActions>
        <CardContent
          component="form"
          onSubmit={handleCommentSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "left",
            maxHeight: 300,
            border: "2px solid #000",
            overflow: "auto",
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
          />
          {comments &&
            comments.map((comment) => (
              <Typography key={comment.id} variant="h5" color="text.secondary">
                {comment.comment}
              </Typography>
            ))}
        </CardContent>
      </Paper>
    </Modal>
  );
}
