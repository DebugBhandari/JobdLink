import React, { useState, useEffect } from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import axios from "axios";
import LinkModal from "./Modals/LinkModal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function Link({
  job,
  setLikeCommentRefresh,
  likeCommentRefresh,
}) {
  const [userNames, setUserNames] = useState([]);
  const user_id_JSON = JSON.parse(localStorage.getItem("user_id"));
  const created_at = new Date(job.created_at);
  const [jobOwner, setJobOwner] = useState();
  const [userLiked, setUserLiked] = useState();
  const locale_date = created_at.toLocaleDateString();

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

  //For modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  //For Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLikeClick = async (e) => {
    axios
      .post("http://localhost:3001/jobLike", {
        job_id: job.id,
        user_id: user_id_JSON,
      })
      .then((response) => {
        console.log("Liked", response.data);
        setUserLiked(true);
        setLikeCommentRefresh((prevState) => !prevState);
      });
  };
  const handleUnlikeClick = async (e) => {
    axios
      .delete(`http://localhost:3001/jobLike/${job.id}/${user_id_JSON}`)
      .then((response) => {
        console.log("Unliked");
        setUserLiked(false);
        setLikeCommentRefresh((prevState) => !prevState);
      });
  };

  const hasUserLiked = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/jobLike/${job.id}/${user_id_JSON}/bool`
      );
      setUserLiked(response.data);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const fetchUsernames = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/jobLike/${job.id}/usernames`
      );
      setUserNames(response.data);
    } catch (error) {
      console.error("Error fetching usernames:", error);
    }
  };

  const fetchJobOwner = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/jobs/${job.id}/user`
      );
      setJobOwner(response.data);
    } catch (error) {
      console.error("Error fetching job owner:", error);
    }
  };

  useEffect(() => {
    hasUserLiked();
    fetchUsernames();
    fetchJobOwner();
  }, [likeCommentRefresh]);

  return (
    <Paper
      elevation={3}
      sx={{ minWidth: 345, margin: 3, minHeight: 300, borderRadius: 4 }}
    >
      <CardContent
        sx={{
          height: 80,
          bgcolor: "success.main",
          ...(job.status === "Rejected" && { bgcolor: "error.main" }),
          ...(job.status === "Not Applied" && { bgcolor: "primary.main" }), // Conditional styling
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
          height: 150,
        }}
      >
        <Typography gutterBottom variant="h6" component="div">
          {jobOwner && jobOwner.username}
        </Typography>
        <Typography gutterBottom variant="h8">
          {job.jobTitle}
        </Typography>

        <Typography variant="h6">{job.status}</Typography>

        <Typography variant="h8" color="text.secondary">
          {job.caption}
        </Typography>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Button onClick={handleOpen} sx={{ ...buttonHover }}>
            {job.count_comments} Comments
          </Button>

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
              <MenuItem key={user.username + "like"} onClick={handleMenuClose}>
                {user.username}
              </MenuItem>
            ))}
          </Menu>
        </CardContent>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "center",
          height: 30,
          marginBottom: 4,
          marginTop: 0,
        }}
      >
        {userLiked === "false" ? (
          <Button
            size="small"
            onClick={handleLikeClick}
            sx={{
              ...buttonHover,
            }}
          >
            Like
          </Button>
        ) : (
          <Button
            size="small"
            onClick={handleUnlikeClick}
            sx={{
              ...buttonHover,
            }}
          >
            Unlike
          </Button>
        )}
      </CardActions>
      <LinkModal
        job={job}
        open={open}
        handleClose={handleClose}
        handleLikeClick={handleLikeClick}
        handleUnlikeClick={handleUnlikeClick}
        userLiked={userLiked}
        userNames={userNames}
        jobOwner={jobOwner}
        locale_date={locale_date}
        user_id_JSON={user_id_JSON}
        setLikeCommentRefresh={setLikeCommentRefresh}
        likeCommentRefresh={likeCommentRefresh}
      />
    </Paper>
  );
}
