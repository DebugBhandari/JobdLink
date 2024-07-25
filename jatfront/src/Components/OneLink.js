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

  //For Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLikeClick = async () => {
    axios
      .post(`${baseUrl}/jobLike`, {
        job_id: job.id,
        user_id: user_id_JSON,
      })
      .then((response) => {
        console.log("Liked", response.data);
        setUserLiked(true);
        addZJobLike({ job_id: job.id, user_id: user_id_JSON });
        setLikeCommentRefresh((prevState) => !prevState);
        setZJobLikesUsernames(job.id);
      });
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

  return (
    <Paper
      elevation={3}
      sx={{
        margin: 4,
        minHeight: 360,
        width: 360,

        borderRadius: 4,

        "@media (max-width:600px)": {
          minWidth: "70dvw",
          margin: 4,
        },
      }}
    >
      <CardContent
        sx={{
          height: 70,
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
          flexDirection: "column",
          justifyContent: "left",
          alignItems: "left",
          minHeight: 160,
          pb: 0,
          overflow: "auto",
        }}
      >
        {" "}
        <div className="rowDiv">
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
          <Typography sx={{ fontSize: "16px" }}>{job.status}</Typography>
        </div>
        <Typography sx={{ fontSize: "16px" }} color="text.secondary">
          {job.jobUrl}
        </Typography>
        <Typography sx={{ fontSize: "16px" }}>{job.caption}</Typography>
      </CardContent>
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          fontSize: "16px",
          py: 0,
        }}
      >
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
          <Button sx={{ ...buttonHover }}>{job.count_comments} Comments</Button>
        </Link>

        <Button onClick={handleMenuClick} sx={{ ...buttonHover }}>
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
      </CardContent>
      {!fromJobd === true ? (
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 30,
            marginTop: 0,
            fontSize: "16px",
            py: 0,
          }}
        >
          {userLiked === false ? (
            <Button
              size="small"
              onClick={() => handleLikeClick()}
              sx={{
                fontSize: "16px",
                ...buttonHover,
              }}
            >
              Like
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
              Unlike
            </Button>
          )}
        </CardActions>
      ) : (
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 30,
            marginTop: 0,
            fontSize: "16px",
            width: "90%",
            px: "20px",
          }}
        >
          <Button
            size="small"
            onClick={() => {
              toggleJobdLink(job.id);
              setZJobs();
            }}
            sx={{
              fontSize: "14px",
              color: "#ff00009b",
              fontWeight: 800,
              ...buttonHover,
            }}
          >
            Jobd
          </Button>{" "}
        </CardActions>
      )}
    </Paper>
  );
}
