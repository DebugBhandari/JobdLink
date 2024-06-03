import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Car from "../assets/car_feature.jpg";

export default function Link({ job }) {
  const created_at = new Date(job.created_at);
  const locale_date = created_at.toLocaleDateString();
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
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "center" }}>
        <Button size="small">Like</Button>
      </CardActions>
    </Paper>
  );
}
