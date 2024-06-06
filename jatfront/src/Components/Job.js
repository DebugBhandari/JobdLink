import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import EditJob from "./EditJob";
import axios from "axios";
import EditJobModal from "./Modals/EditJobModal";

export default function Job({ job, setJobsRefresh }) {
  const created_at = new Date(job.created_at);
  const locale_date = created_at.toLocaleDateString();

  //For modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = (e) => {
    setOpen(false);
  };

  const handleDeleteClick = () => {
    axios.delete(`http://localhost:3001/jobs/${job.id}`).then((response) => {
      setJobsRefresh((prevState) => !prevState);
      console.log("Job deleted successfully");
    });
  };

  return (
    <>
      <EditJobModal
        job={job}
        setJobsRefresh={setJobsRefresh}
        open={open}
        handleClose={handleClose}
      />
      <Paper elevation={3} sx={{ width: 400, margin: 3, maxHeight: 500 }}>
        <CardContent
          sx={{
            height: 80,
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
            {job.jobTitle}
          </Typography>

          <Typography variant="h8" color="primary.">
            {job.status}
          </Typography>
          <Typography variant="h8" color="text.secondary">
            {job.jobUrl}
          </Typography>
          <Typography variant="h8" color="text.secondary">
            {job.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.private ? "Private" : "Link"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.caption}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.user_id}
          </Typography>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button size="small" onClick={handleOpen}>
            Edit
          </Button>
          <Button size="small" onClick={handleDeleteClick}>
            Delete
          </Button>
        </CardActions>
      </Paper>
    </>
  );
}
