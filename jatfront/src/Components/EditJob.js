import React, { useState } from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { Select, MenuItem, Box } from "@mui/material";

const EditJob = ({ job, setIsEditing, setJobsRefresh }) => {
  const jobId = job.id;
  const CardActionsStyled = styled(CardActions)({
    display: "flex",
    justifyContent: "center",
  });
  const CardContentStyled = styled(CardContent)({
    padding: 0,
    wrap: "wrap",
  });
  const TextFieldStyled = styled(TextField)({
    margin: 4,
  });

  const handleEditClick = () => {
    setTimeout(() => {
      setIsEditing(false);
      setJobsRefresh((prevState) => !prevState);
    }, 500);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios
      .put(`http://localhost:3001/jobs/${jobId}`, {
        jobTitle: data.get("jobTitle"),
        company: data.get("company"),
        jobUrl: data.get("jobUrl"),
        status: data.get("status"),
        location: data.get("location"),
        username: data.get("username"),
        private: data.get("row-radio-buttons-group") === "true" ? true : false,
        user_id: localStorage.getItem("user_id"),
        description: data.get("description"),
        caption: data.get("caption"),
      })
      .then((response) => {
        console.log(`Job ${jobId} updated successfully`);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 350,
        margin: 3,
        minHeight: 400,
        padding: 2,
        bgcolor: "secondary.light",
      }}
      component="form"
      noValidate
      onSubmit={handleSubmit}
    >
      <CardContentStyled>
        <TextFieldStyled
          margin="normal"
          required
          fullWidth
          id="jobTitleEdit"
          label="Job Title"
          name="jobTitle"
          defaultValue={job.jobTitle}
          autoComplete="jobTitle"
          autoFocus
          size="small"
        />
        <TextFieldStyled
          margin="normal"
          required
          fullWidth
          id="companyEdit"
          label="Company"
          name="company"
          defaultValue={job.company}
          autoComplete="company"
          autoFocus
          size="small"
        />
        <TextFieldStyled
          margin="normal"
          required
          fullWidth
          id="jobUrlEdit"
          label="Job URL"
          name="jobUrl"
          defaultValue={job.jobUrl}
          autoComplete="jobUrl"
          autoFocus
          size="small"
        />
        <TextFieldStyled
          margin="normal"
          required
          fullWidth
          id="descriptionEdit"
          label="Description"
          name="description"
          defaultValue={job.description}
          autoComplete="description"
          autoFocus
          size="small"
        />
        <TextFieldStyled
          margin="normal"
          required
          fullWidth
          id="captionEdit"
          label="Caption"
          name="caption"
          defaultValue={job.caption}
          autoComplete="caption"
          autoFocus
          size="small"
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 1,
          }}
        >
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue={job.private ? "true" : "false"}
          >
            <FormControlLabel
              value={true}
              control={<Radio />}
              label="Private"
            />
            <FormControlLabel value={false} control={<Radio />} label="Link" />
          </RadioGroup>
          <Select
            name="status"
            defaultValue={job.status}
            label="Status"
            size="small"
            width="50%"
          >
            <MenuItem value="Not Applied">Not Applied</MenuItem>
            <MenuItem value="Applied">Applied</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="1st Interview">1st Interview</MenuItem>
            <MenuItem value="Task">Task</MenuItem>
            <MenuItem value="2nd Interview">2nd Interview</MenuItem>
            <MenuItem value="Jobd">Jobd</MenuItem>
          </Select>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 1,
          }}
        >
          <TextFieldStyled
            margin="normal"
            required
            width="50%"
            id="locationEdit"
            label="Location"
            name="location"
            defaultValue={job.location}
            autoComplete="location"
            autoFocus
            size="small"
          />
          <TextFieldStyled
            margin="normal"
            required
            width="50%"
            id="usernameEdit"
            label="Username"
            name="username"
            defaultValue={job.username}
            autoComplete="username"
            autoFocus
            size="small"
          />
        </Box>
      </CardContentStyled>
      <CardActionsStyled>
        <Button
          size="small"
          justify="center"
          type="submit"
          onClick={handleEditClick}
        >
          Update Job
        </Button>
      </CardActionsStyled>
    </Paper>
  );
};

export default EditJob;
