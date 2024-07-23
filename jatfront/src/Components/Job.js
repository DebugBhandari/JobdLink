import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import EditJob from "./EditJob";
import axios from "axios";
import EditJobModal from "./Modals/EditJobModal";
import useJLStore from "../useStore";
import { baseUrl } from "../App";

export const loadLocal = async (key) => {
  return await localStorage.getItem(key);
};

export default function Job({ job, setJobsRefresh }) {
  const created_at = new Date(job.created_at);
  const locale_date = created_at.toLocaleDateString();

  const [content, setContent] = useState("This is a test post from JobdLink.");
  const setZJobs = useJLStore((state) => state.setZJobs);
  const toggleJobdLink = useJLStore((state) => state.toggleJobdLink);
  //For modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = (e) => {
    setOpen(false);
    setJobsRefresh((prevState) => !prevState);
  };

  const handleDeleteClick = () => {
    axios.delete(`${baseUrl}/jobs/${job.id}`).then((response) => {
      setJobsRefresh((prevState) => !prevState);
      console.log("Job deleted successfully");
    });
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

  const handlePost = async () => {
    const token = await loadLocal("tokenJL");
    const linkedinId = await loadLocal("linkedinIdJL");

    if (!token || !content) return;

    try {
      const response = await axios.post(`${baseUrl}/share`, {
        token,
        content,
        linkedinId,
      });

      if (response.data.success) {
        alert("Post successful!");
      } else {
        alert("Failed to post!");
      }
    } catch (error) {
      console.error(error);
      alert("Error posting to LinkedIn");
    }
  };

  return (
    <>
      <EditJobModal
        job={job}
        setJobsRefresh={setJobsRefresh}
        open={open}
        handleClose={handleClose}
      />
      <Paper
        elevation={3}
        sx={{
          margin: 4,
          minHeight: 360,
          width: 360,

          borderRadius: 4,

          // "@media (max-width: 1000px)": {
          //   minWidth: "70dvw",
          //   margin: 4,
          // },
        }}
      >
        <CardContent
          sx={{
            height: 70,
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
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "left",
            minHeight: 160,
            pb: 0,
          }}
        >
          <div className="rowDiv">
            {" "}
            <Typography variant="h8">
              {job.private ? "Private" : "Linkd"}
            </Typography>
            <Typography variant="h8" color="primary.">
              {job.status}
            </Typography>
          </div>

          <div className="rowDiv">
            <Typography variant="h8" color="text.secondary">
              {job.username}
            </Typography>
          </div>
          <Typography variant="h8" color="text.secondary">
            {job.jobUrl}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.caption}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.description}
          </Typography>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button size="small" onClick={handleOpen} sx={{ ...buttonHover }}>
            Edit
          </Button>
          <Button
            size="small"
            onClick={handleDeleteClick}
            sx={{ ...buttonHover }}
          >
            Delete
          </Button>

          <Button
            onClick={() => {
              toggleJobdLink(job.id);
              setZJobs();
            }}
            sx={{ color: "#388e3c", fontWeight: 800, ...buttonHover }}
          >
            Link
          </Button>
        </CardActions>
      </Paper>
    </>
  );
}
