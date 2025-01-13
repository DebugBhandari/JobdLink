import React, { useEffect, useState } from "react";
import { useForm, Controller, set } from "react-hook-form";
import {
  Paper,
  CardActions,
  CardContent,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Box,
  Button,
  Typography,
  FormControl,
  FormLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import useJLStore from "../useStore";
import { baseUrl } from "../App";
import { useLocation, useNavigate } from "react-router-dom";

const CardActionsStyled = styled(CardActions)({
  display: "flex",
  justifyContent: "center",
});

const CardContentStyled = styled(CardContent)({ padding: 0 });

const TextFieldStyled = styled(TextField)({
  padding: 0,
});

const AlertMessage = styled(Typography)({
  color: "black",
  textAlign: "center",
  margin: "16px 0",
});

const EditJobComp = () => {
  const zUser = useJLStore((state) => state.zUser);
  const setZJobs = useJLStore((state) => state.setZJobs);
  const local_user_id = zUser.id;
  const navigate = useNavigate();

  const locationPath = useLocation();
  const paramsId = parseInt(locationPath.pathname.split("/")[2]);

  const [job, setJob] = useState({});

  const { control, handleSubmit, setValue } = useForm();

  const fetchJobById = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/jobs/${id}`);
      setJob(response.data);
      Object.entries(response.data).forEach(([key, value]) => {
        setValue(key, value);
      });
    } catch (error) {
      console.error("Error fetching job:", error);
    }
  };

  const onSubmit = (data) => {
    axios
      .put(`${baseUrl}/jobs/${job.id}`, {
        ...data,

        user_id: local_user_id,
      })
      .then((response) => {
        console.log(`Job ${job.id} updated successfully`);
        console.log(response.data);
        setZJobs();
        navigate("/JAT");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchJobById(paramsId);
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        width: "60%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        boxShadow: 0,
        margin: "auto",
        marginTop: "10dvh",
        marginBottom: "20dvh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        borderRadius: 10,
        "@media (max-width: 600px)": { width: "90%" },
      }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2>Update {job.jobTitle}</h2>
      <CardContentStyled>
        <Controller
          name="jobTitle"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextFieldStyled
              {...field}
              margin="normal"
              required
              fullWidth
              id="jobTitle"
              label="Job Title"
              size="small"
              sx={{ marginTop: 2 }}
              autoComplete="jobTitle"
              focused
            />
          )}
        />
        <Controller
          name="company"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextFieldStyled
              {...field}
              margin="normal"
              required
              fullWidth
              id="company"
              label="Company"
              size="small"
              autoComplete="company"
              focused
              sx={{ marginTop: 2 }}
            />
          )}
        />
        <Controller
          name="jobUrl"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextFieldStyled
              {...field}
              margin="normal"
              fullWidth
              id="jobUrl"
              label="Job URL"
              size="small"
              autoComplete="jobUrl"
              focused
              sx={{ marginTop: 2 }}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextFieldStyled
              {...field}
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              id="description"
              label="Description"
              size="small"
              sx={{ marginTop: 2 }}
              autoComplete="description"
              focused
            />
          )}
        />
        <Controller
          name="caption"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextFieldStyled
              {...field}
              margin="normal"
              required
              fullWidth
              multiline
              rows={2}
              id="caption"
              label="Caption"
              size="small"
              autoComplete="caption"
              focused
              sx={{ marginTop: 2 }}
            />
          )}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 1,
          }}
        >
          <Controller
            name="status"
            control={control}
            defaultValue="Not Applied"
            render={({ field }) => (
              <Select {...field} label="Status" size="small" width="50%">
                <MenuItem value="Not Applied">Not Applied</MenuItem>
                <MenuItem value="Applied">Applied</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="1st Interview">1st Interview</MenuItem>
                <MenuItem value="Task">Task</MenuItem>
                <MenuItem value="2nd Interview">2nd Interview</MenuItem>
                <MenuItem value="Jobd">Jobd</MenuItem>
              </Select>
            )}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 1,
          }}
        >
          <Controller
            name="location"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextFieldStyled
                {...field}
                margin="normal"
                width="50%"
                id="location"
                label="Location"
                size="small"
                autoComplete="location"
                focused
                sx={{ marginTop: 2 }}
              />
            )}
          />
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextFieldStyled
                {...field}
                margin="normal"
                width="50%"
                id="username"
                label="Username"
                size="small"
                autoComplete="username"
                focused
                sx={{ marginTop: 2 }}
              />
            )}
          />
        </Box>
      </CardContentStyled>
      <CardActionsStyled>
        <Button
          size="big"
          justify="center"
          type="submit"
          sx={{
            textDecoration: "none",
            fontSize: 14,
            fontWeight: "bolder",
            backgroundColor: "#2a2e45",
            width: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            padding: "6px",
            color: "white",
            "&:hover": {
              backgroundColor: "white",
              color: "#2a2e45",
            },
          }}
          disabled={!zUser}
        >
          Update Job
        </Button>
      </CardActionsStyled>
    </Paper>
  );
};

export default EditJobComp;
