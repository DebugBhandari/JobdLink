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
import Link from "@mui/material/Link";

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
      setZJobs();
      console.log("Job deleted successfully");
    });
  };

  const handleEditJob = () => {
    window.location.href = `/editJob/${job.id}`;
  };
  const buttonHover = {
    borderRadius: 10,
    textDecoration: "none",
    "&:hover": {
      bgcolor: "success.main",
      ...(job.status === "Rejected" && { bgcolor: "error.main" }),
      ...(job.status === "Not Applied" && {
        bgcolor: "primary.main",
      }),
      color: "white",
    },
  };
  const linkButtonHover = {
    "&:hover": {
      color: "success.main",
      ...(job.status === "Rejected" && { color: "error.main" }),
      ...(job.status === "Not Applied" && {
        color: "primary.main",
      }),
      bgcolor: "white",
    },
  };

  return (
    <>
      <EditJobModal
        job={job}
        setJobsRefresh={setJobsRefresh}
        open={open}
        handleClose={handleClose}
      />
      <div className="linkViewCard">
        <CardContent
          sx={{
            height: 70,
            width: "90%",
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
            position: "relative",
            padding: 1,
            borderRadius: 4,
          }}
        >
          {" "}
          <Typography
            sx={{
              fontSize: 28,
              overflow: "auto",
            }}
            title={job.jobTitle}
          >
            {job.jobTitle}
          </Typography>
          <Typography
            gutterBottom
            sx={{ fontSize: "16px", wordBreak: "break-all" }}
          >
            {job.company.slice(0, 22) + ", " + job.location}
          </Typography>
        </CardContent>
        <CardContent
          sx={{
            display: "flex",
            width: "92%",
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "left",
            height: 160,
            overflow: "auto",
            pb: 0,
          }}
        >
          <div className="rowDiv">
            {" "}
            <h1 className="headerNormalText">
              {" "}
              {job.private ? "Private" : "Linkd"}
            </h1>
            <h1 className="headerNormalText">{job.status}</h1>
          </div>

          <div className="rowDiv">
            <Typography
              variant="h8"
              color="text.secondary"
              sx={{ wordBreak: "break-all" }}
            >
              {job.username}
            </Typography>
            <Typography variant="h8" color="primary.">
              {job.created_at.slice(0, 10)}
            </Typography>
          </div>
          <Typography
            variant="h8"
            color="text.secondary"
            sx={{ wordBreak: "break-all" }}
          >
            {job.jobUrl}
          </Typography>
          <h1 className="headerGreyText">{job.caption}</h1>
          <h1 className="headerNormalText">{job.description}</h1>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button size="small" onClick={handleEditJob} sx={{ ...buttonHover }}>
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
            sx={{
              fontWeight: 800,

              bgcolor: "success.main",
              ...(job.status === "Rejected" && { bgcolor: "error.main" }),
              ...(job.status === "Not Applied" && {
                bgcolor: "primary.main",
              }),
              color: "white",
              height: "30px",
              fontSize: "12px",
              borderRadius: 10,
              color: "white",
              ...linkButtonHover,
            }}
          >
            {job.private ? "Link" : "Unlink"}
          </Button>
        </CardActions>
      </div>
    </>
  );
}
