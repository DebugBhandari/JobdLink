import React, { useState, useEffect } from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import useJLStore from "../useStore";
import TextField from "@mui/material/TextField";

import { baseUrl } from "../App";

export default function Comment({ comment, setLikeCommentRefresh }) {
  const emailJL = useJLStore((state) => state.zUser.email);
  const idJL = useJLStore((state) => state.zUser.id);
  const removeZJobComment = useJLStore((state) => state.removeZJobComment);
  const updateZJobComment = useJLStore((state) => state.updateZJobComment);
  const zJobComments = useJLStore((state) => state.zJobComments);
  const [editComment, setEditComment] = useState(false);
  const [updatedComment, setUpdatedComment] = useState(comment.comment);

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
    setLikeCommentRefresh((prevState) => !prevState);
    axios
      .delete(`${baseUrl}/jobComment/${comment.id}/${idJL}`)
      .then((response) => {
        console.log("Comment deleted successfully");
        console.log(response);
        removeZJobComment(comment.id);
      });
  };

  const handleCommentEdit = (comment) => {
    axios
      .put(`${baseUrl}/jobComment/${comment.id}`, {
        comment: updatedComment,
      })
      .then((response) => {
        console.log("Comment updated successfully");
        console.log(response);
        setEditComment((prevState) => !prevState);
        updateZJobComment({ id: comment.id, comment: updatedComment });
        setLikeCommentRefresh((prevState) => !prevState);
        if (updatedComment === "") {
          handleCommentDelete();
        }
      });
  };
  // const handleCommentEdit = () => {
  //   setEditComment((prevState) => !prevState);
  // };
  useEffect(() => {
    setLikeCommentRefresh((prevState) => !prevState);
  }, []);

  return (
    <Paper elevation={3} sx={{ borderRadius: 4, margin: 1, minheight: 100 }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="commentAvatar">
          <Avatar
            alt={comment.imageUrl}
            src={comment.imageUrl}
            sx={{ width: 36, height: 36 }}
          />
          <Typography sx={{ fontSize: "18px", fontWeight: "bold", margin: 2 }}>
            {comment.name}
          </Typography>
        </div>
        {editComment ? (
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
            onSubmit={handleCommentEdit}
            onChange={(e) => setUpdatedComment(e.target.value)}
            value={updatedComment}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleCommentEdit(comment);
              }
            }}
          />
        ) : (
          <Typography
            variant="body2"
            color="primary.mains"
            sx={{ textAlign: "left", fontSize: 16, wordWrap: "break-word" }}
          >
            {comment.comment}
          </Typography>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "right" }}
        >
          {timeAgo(new Date(comment.commentedAt))}
        </Typography>
        {comment.email === emailJL ? (
          <CardActions sx={{ justifyContent: "center", padding: 0 }}>
            <Button
              size="small"
              onClick={handleCommentDelete}
              sx={{
                "&:hover": { backgroundColor: "primary.main", color: "white" },
              }}
            >
              Delete{" "}
            </Button>
            {!editComment ? (
              <Button
                size="small"
                onClick={() => setEditComment((prevState) => !prevState)}
                sx={{
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                }}
              >
                Edit
              </Button>
            ) : (
              <Button
                size="small"
                onClick={() => handleCommentEdit(comment)}
                sx={{
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                }}
              >
                Confirm
              </Button>
            )}
          </CardActions>
        ) : null}
      </CardContent>
    </Paper>
  );
}
