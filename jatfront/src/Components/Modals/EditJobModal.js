import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import { Select, MenuItem, Box } from "@mui/material";
import useJLStore from "../../useStore";

import { baseUrl } from "../../App";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 350,
  margin: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

export default function EditJobModal({
  job,
  setJobsRefresh,
  open,
  handleClose,
  ...props
}) {
  const zUser = useJLStore((state) => state.zUser);
  const local_user_id = zUser.id;
  const CardActionsStyled = styled(CardActions)({
    display: "flex",
    justifyContent: "center",
  });
  const CardContentStyled = styled(CardContent)({
    padding: 20,
    wrap: "wrap",
    marginTop: 10,
  });
  const TextFieldStyled = styled(TextField)({
    margin: 4,
  });

  const handleEditClick = () => {
    setTimeout(() => {
      handleClose();
      setJobsRefresh((prevState) => !prevState);
    }, 500);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios
      .put(`${baseUrl}/jobs/${job.id}`, {
        jobTitle: data.get("jobTitle"),
        company: data.get("company"),
        jobUrl: data.get("jobUrl"),
        status: data.get("status"),
        location: data.get("location"),
        username: data.get("username"),
        private: data.get("row-radio-buttons-group") === "true" ? true : false,
        user_id: local_user_id,
        description: data.get("description"),
        caption: data.get("caption"),
      })
      .then((response) => {
        console.log(`Job ${job.id} updated successfully`);
        console.log(response.data);

        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Paper
        elevation={3}
        sx={{
          ...style,
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <CardContent
          sx={{
            height: 60,
            width: "90%",
            borderRadius: 4,
            bgcolor: "success.main",
            ...(job.status === "Rejected" && { bgcolor: "error.main" }),
            ...(job.status === "Not Applied" && {
              bgcolor: "primary.main",
            }), // Conditional styling
            color: "white",
            fontSize: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: 0,

            border: "2px solid #000",
          }}
        ></CardContent>
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
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Link"
              />
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
            sx={{
              "&:hover": {
                bgcolor: "success.main",
                ...(job.status === "Rejected" && { bgcolor: "error.main" }),
                ...(job.status === "Not Applied" && {
                  bgcolor: "primary.main",
                }),
                color: "white",
              },
            }}
          >
            Update Job
          </Button>
        </CardActionsStyled>
      </Paper>
    </Modal>
  );
}
