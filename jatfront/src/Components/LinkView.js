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
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CommentIcon from "@mui/icons-material/Comment";
import Link from "@mui/material/Link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import captureScreenshot from "../utils/LinkedinApi";

import Typography from "@mui/material/Typography";
//import { JLStoreContext } from "../App";

import {
  useSearchParams,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { baseUrl } from "../App";
import OneLink from "./OneLink";

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

  // const location = useLocation();
  // const paramsId = parseInt(location.pathname.split("/")[2]);
  // const navigate = useNavigate();

  const { id } = useParams();
  const {
    zJobs,
    setZJobs,
    getJobById,
    zUser,
    zJobLikes,
    setZJobLikes,
    addZJobLike,
    removeZJobLike,
    zJobLikesUsernames,
    setZJobLikesUsernames,
    toggleJobdLink,
  } = useJLStore((state) => ({
    zJobs: state.zJobs,
    setZJobs: state.setZJobs,
    getJobById: state.getJobById,
    zUser: state.zUser,
    zJobLikes: state.zJobLikes,
    setZJobLikes: state.setZJobLikes,
    addZJobLike: state.addZJobLike,
    removeZJobLike: state.removeZJobLike,
    zJobLikesUsernames: state.zJobLikesUsernames,
    setZJobLikesUsernames: state.setZJobLikesUsernames,
    toggleJobdLink: state.toggleJobdLink,
  }));

  const [likeCommentRefresh, setLikeCommentRefresh] = useState(false);
  const ref = useRef();
  const [job, setJob] = useState({
    company: "",
    created_at: "",
  });
  const [comments, setComments] = useState([]);
  const isLikeInStore = zJobLikes.find((like) => like.job_id === job.id)
    ? true
    : false;
  const [userLiked, setUserLiked] = useState(isLikeInStore);
  const [userNames, setUserNames] = useState([]);
  const user_id_JSON = parseInt(zUser.id);
  const { linkedinId, token } = zUser;

  // const getUsersLikes = async () => {
  //   try {
  //     const response = await axios.get(`${baseUrl}/jobLike/${user_id_JSON}`);
  //     setZJobLikes(response.data);
  //   } catch (error) {
  //     console.error("Error fetching likes:", error);
  //   }
  // };
  // const handleLikeClick = async () => {
  //   user_id_JSON
  //     ? axios
  //         .post(`${baseUrl}/jobLike`, {
  //           job_id: job.id,
  //           user_id: user_id_JSON,
  //         })
  //         .then((response) => {
  //           console.log("Liked", response.data);
  //           setUserLiked((prevState) => !prevState);
  //           addZJobLike({ job_id: job.id, user_id: user_id_JSON });
  //           setLikeCommentRefresh((prevState) => !prevState);
  //           setZJobs();
  //           setZJobLikesUsernames(job.id);
  //         })
  //     : alert("Please login to like the job.");
  // };
  // const handleUnlikeClick = async () => {
  //   axios
  //     .delete(`${baseUrl}/jobLike/${job.id}/${user_id_JSON}`)
  //     .then((response) => {
  //       console.log("Unliked");
  //       setUserLiked((prevState) => !prevState);
  //       removeZJobLike(job.id);
  //       setLikeCommentRefresh((prevState) => !prevState);
  //       setZJobs();
  //       setZJobLikesUsernames(job.id);
  //     });
  // };

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

  const fetchJobById = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/jobs/${id}`);
      console.log("response", response.data);
      setJob(response.data);
    } catch (error) {
      console.error("Error fetching job:", error);
    }
  };
  const fetchComments = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/jobComment/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

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
            // addZJobComment({
            //   comment: response.data.comment,
            //   email: zUser.email,
            //   imageUrl: zUser.imageUrl,
            //   name: zUser.name,
            //   commentedAt: new Date(),
            // });
            fetchComments(id);
            setLikeCommentRefresh((prevState) => !prevState);
          })
          .catch((error) => {
            console.log(error);
          })
      : alert("Please login to comment.");
  };

  const getUsersLikes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/jobLike/${user_id_JSON}`
      );
      setZJobLikes(response.data);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

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

  useEffect(() => {
    fetchJobById(id);
    fetchComments(id);
    getUsersLikes();
    //setZJobComments(id);
    setZJobLikesUsernames(id);
  }, [likeCommentRefresh]);
  console.log("job", job);
  console.log("comments", comments);
  console.log("paramsId", id);
  const headerStyleConditional = { backgroundColor: "#388e3c" };
  job.status === "Rejected" &&
    (headerStyleConditional.backgroundColor = "#d32f2f");
  job.status === "Not Applied" &&
    (headerStyleConditional.backgroundColor = "#2a2e45");

  return (
    <div className="linkView">
      <div className="linkViewSections">
        <OneLink
          job={job}
          likeCommentRefresh={likeCommentRefresh}
          setLikeCommentRefresh={setLikeCommentRefresh}
          fromJobd={false}
          key={job.id}
        />
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
          {comments &&
            comments.map((comment) => (
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
