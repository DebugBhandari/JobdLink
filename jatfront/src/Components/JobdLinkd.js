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
}) {
  //const [job, setJob] = useState(mappedJob);
  const [userNames, setUserNames] = useState([]);
  const zUser = useJLStore((state) => state.zUser);
  const user_id_JSON = parseInt(zUser.id);
  console.log("user_id_JSON", user_id_JSON);
  console.log("job-id", job.id);
  //const created_at = new Date(job.created_at);
  const [userLiked, setUserLiked] = useState();
  //const locale_date = created_at.toLocaleDateString();
  //const nameJL = loadLocal("nameJL");
  //const navigate = useNavigate();
  // const {
  //   zJobs,
  //   setZJobs,
  //   zJobComments,
  //   setZJobComments,
  //   zJobLikes,
  //   setZJobLikes,
  //   zUser,
  //   setZUser,
  // } = useJLStore((state) => ({
  //   zJobs: state.zJobs,
  //   setZJobs: state.setZJobs,
  //   zJobComments: state.zJobComments,
  //   setZJobComments: state.setZJobComments,
  //   zJobLikes: state.zJobLikes,
  //   setZJobLikes: state.setZJobLikes,
  //   zUser: state.zUser,
  //   setZUser: state.setZUser,
  // }));
  //const { contextData, setContextData } = useContext(JLStoreContext);

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
    console.log("job.id fffff", job.id);
    console.log("user_id_JSON ffff", user_id_JSON);
    axios
      .post(`${baseUrl}/jobLike`, {
        job_id: job.id,
        user_id: user_id_JSON,
      })
      .then((response) => {
        console.log("Liked", response.data);
        setUserLiked(true);
      });
  };
  const handleUnlikeClick = async () => {
    axios
      .delete(`${baseUrl}/jobLike/${job.id}/${user_id_JSON}`)
      .then((response) => {
        console.log("Unliked");
        setUserLiked(false);
      });
  };

  const hasUserLiked = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/jobLike/${job.id}/${user_id_JSON}/bool`
      );
      setUserLiked(response.data);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const fetchUsernames = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/jobLike/${job.id}/usernames`
      );
      setUserNames(response.data);
    } catch (error) {
      console.error("Error fetching usernames:", error);
    }
  };

  // const handleJobClick = (id) => {
  //   navigate(`/links/${id}`, { state: { job } });
  // };

  // const fetchJobOwner = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:3001/jobs/${job.id}/user`
  //     );
  //     setJobOwner(response.data);
  //   } catch (error) {
  //     console.error("Error fetching job owner:", error);
  //   }
  // };

  useEffect(() => {
    hasUserLiked();
    fetchUsernames();
    // fetchJobOwner();
  }, [likeCommentRefresh, setLikeCommentRefresh]);

  return (
    <Paper
      elevation={3}
      sx={{
        width: "80dvw",
        margin: 1,
        minHeight: 360,
        borderRadius: 4,

        "@media (min-width: 600px)": {
          width: 360,
          margin: 3,
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
        {userNames[0] ? (
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
                {user.name}
              </MenuItem>
            ))}
          </Menu>
        ) : null}
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "center",
          height: 30,
          marginTop: 0,
          fontSize: "16px",
          py: 0,
        }}
      >
        {userLiked === "false" ? (
          <Button
            size="small"
            onClick={handleLikeClick}
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
            onClick={handleUnlikeClick}
            sx={{
              fontSize: "16px",
              ...buttonHover,
            }}
          >
            Unlike
          </Button>
        )}
      </CardActions>
    </Paper>
  );
}
