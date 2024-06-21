import React, { useState, useEffect } from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import axios from "axios";

export default function Comment({ comment, setLikeCommentRefresh }) {
  const user_id_JSON = JSON.parse(localStorage.getItem("user"));
  const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };

  const handleCommentDelete = () => {
    axios
      .delete(
        `http://localhost:3001/jobComment/${comment.id}/${localStorage.getItem(
          "user_id"
        )}`
      )
      .then((response) => {
        console.log("Comment deleted successfully");
        console.log(response);
        setLikeCommentRefresh((prevState) => !prevState);
      });
  };

  const handleCommentEdit = () => {
    console.log("Edit comment");
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: 4, margin: 1 }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            textAlign: "left",
          }}
          title={comment.username}
        >
          {comment.username}
        </Typography>
        <Typography
          variant="body2"
          color="primary.mains"
          sx={{ textAlign: "left", fontSize: 16 }}
        >
          {comment.comment}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "right" }}
        >
          {timeAgo(new Date(comment.commentedAt))}
        </Typography>
        {comment.email === user_id_JSON ? (
          <CardActions sx={{ justifyContent: "center" }}>
            <Button
              size="small"
              onClick={handleCommentDelete}
              sx={{
                "&:hover": { backgroundColor: "primary.main", color: "white" },
              }}
            >
              Delete{" "}
            </Button>
            <Button
              size="small"
              onClick={handleCommentEdit}
              sx={{
                "&:hover": { backgroundColor: "primary.main", color: "white" },
              }}
            >
              Edit
            </Button>
          </CardActions>
        ) : null}
      </CardContent>
    </Paper>
  );
}
