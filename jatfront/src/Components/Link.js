import * as React from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import axios from "axios";

export default function Link({ job }) {
  const [userNames, setUserNames] = React.useState([]);
  const user_id_JSON = JSON.parse(localStorage.getItem("user_id"));
  const created_at = new Date(job.created_at);
  const [likesRefresh, setLikesRefresh] = React.useState(false);
  const [jobOwner, setJobOwner] = React.useState();
  const [userLiked, setUserLiked] = React.useState();
  const locale_date = created_at.toLocaleDateString();

  const handleLikeClick = (e) => {
    axios
      .post("http://localhost:3001/jobLike", {
        job_id: job.id,
        user_id: JSON.parse(localStorage.getItem("user_id")),
      })
      .then((response) => {
        console.log(response.data, "Liked");
        setUserLiked(true);
        setLikesRefresh((prevState) => !prevState);
      });
  };
  const handleUnlikeClick = (e) => {
    axios
      .delete(`http://localhost:3001/jobLike/${job.id}/${user_id_JSON}`)
      .then((response) => {
        console.log(response.data, "Unliked");
        setUserLiked(false);
        setLikesRefresh((prevState) => !prevState);
      });
  };
  React.useEffect(() => {
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

    fetchUsernames();
    hasUserLiked();
    fetchJobOwner();
  }, [job.id, user_id_JSON, likesRefresh]);

  return (
    <Paper elevation={3} sx={{ minWidth: 345, margin: 3, minHeight: 300 }}>
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
        <Typography variant="h5" color="text.secondary">
          {userNames.length} Likes
        </Typography>
        <Typography variant="h5" color="text.secondary">
          {userNames.map((user) => user.username).join(", ")}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "center" }}>
        {userLiked === "false" ? (
          <Button size="small" onClick={handleLikeClick}>
            Like
          </Button>
        ) : (
          <Button size="small" onClick={handleUnlikeClick}>
            Unlike
          </Button>
        )}
      </CardActions>
    </Paper>
  );
}
