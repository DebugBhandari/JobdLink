import React from "react";
import { useForm } from "react-hook-form";
import {
  Modal,
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
  IconButton,
  Link,
} from "@mui/material";

import LoginIcon from "@mui/icons-material/Login";
import { styled } from "@mui/material/styles";
import axios from "axios";
import useJLStore from "../../useStore";
import { baseUrl } from "../../App";
import { style } from "./LinkModal";

const CardActionsStyled = styled(CardActions)({
  display: "flex",
  justifyContent: "center",
});

const CardContentStyled = styled(CardContent)({
  padding: 0,
});

const TextFieldStyled = styled(TextField)({
  margin: 4,
});

const AlertMessage = styled(Typography)({
  color: "black",
  textAlign: "center",
  margin: "16px 0",
});

const PostJobModal = ({ setJobsRefresh, handleClose, open }) => {
  const zUser = useJLStore((state) => state.zUser);
  const setZJobs = useJLStore((state) => state.setZJobs);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      jobTitle: "",
      company: "",
      jobUrl: "",
      status: "Not Applied",
      location: "",
      username: "",
      private: "true",
      description: "",
      caption: "",
    },
  });

  const onSubmit = async (data) => {
    if (!zUser) {
      alert("Please log in to post a job");
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/jobs`,
        {
          jobTitle: data.jobTitle,
          company: data.company,
          jobUrl: data.jobUrl,
          status: data.status,
          location: data.location,
          username: data.username,
          private: data.private === "true",
          user_id: zUser ? zUser.id : 99999,
          description: data.description,
          caption: data.caption,
        },
        {
          headers: {
            Authorization: "Bearer " + zUser.token,
          },
        }
      );
      console.log(response.data);
      console.log("Job added successfully");
      setZJobs();
      reset(); // Reset the form after successful submission
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefresh = () => {
    setTimeout(() => {
      setJobsRefresh((prevState) => !prevState);
    }, 500);
  };

  if (!zUser.name) {
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
            maxWidth: 340,
            margin: 3,
            minHeight: 100,
            ...style,
          }}
          component="div"
        >
          <AlertMessage variant="h6">Please log in to post a job.</AlertMessage>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
          >
            <Link
              href="/login"
              variant="body"
              style={{
                textDecoration: "none",
                color: "black",
              }}
            >
              <LoginIcon sx={{ fontSize: "46px" }} />
            </Link>
          </IconButton>
        </Paper>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Paper
        elevation={3}
        sx={{ maxWidth: 350, margin: 3, minHeight: 400, padding: 2, ...style }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="linkViewCardHeader">
          <div className="postJobHeader">New Job</div>
        </div>
        <CardContentStyled>
          <TextFieldStyled
            margin="normal"
            required
            fullWidth
            id="jobTitle"
            label="Job Title"
            {...register("jobTitle", { required: "Job Title is required" })}
            error={!!errors.jobTitle}
            helperText={errors.jobTitle?.message}
            size="small"
          />
          <TextFieldStyled
            margin="normal"
            required
            fullWidth
            id="company"
            label="Company"
            {...register("company", { required: "Company is required" })}
            error={!!errors.company}
            helperText={errors.company?.message}
            size="small"
          />
          <TextFieldStyled
            margin="normal"
            fullWidth
            id="jobUrl"
            label="Job URL"
            {...register("jobUrl")}
            size="small"
          />
          <TextFieldStyled
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            id="description"
            label="Description"
            {...register("description", {
              required: "Description is required",
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
            size="small"
          />
          <TextFieldStyled
            margin="normal"
            required
            fullWidth
            multiline
            rows={2}
            id="caption"
            label="Caption"
            {...register("caption", { required: "Caption is required" })}
            error={!!errors.caption}
            helperText={errors.caption?.message}
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
              {...register("private")}
              defaultValue="true"
            >
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="Private"
              />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="Public"
              />
            </RadioGroup>
            <Select
              {...register("status", { required: "Status is required" })}
              defaultValue="Not Applied"
              label="Status"
              size="small"
              error={!!errors.status}
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
              id="location"
              label="Location"
              {...register("location", { required: "Location is required" })}
              error={!!errors.location}
              helperText={errors.location?.message}
              size="small"
            />
            <TextFieldStyled
              margin="normal"
              width="50%"
              id="username"
              label="Username"
              {...register("username")}
              size="small"
            />
          </Box>
        </CardContentStyled>
        <CardActionsStyled>
          <Button
            size="small"
            justify="center"
            type="submit"
            onClick={handleRefresh}
            sx={{
              "&:hover": { backgroundColor: "primary.main", color: "white" },
            }}
            disabled={!zUser}
          >
            Add Job
          </Button>
        </CardActionsStyled>
      </Paper>
    </Modal>
  );
};

export default PostJobModal;

// import React, { useState } from "react";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import { styled } from "@mui/material/styles";
// import Radio from "@mui/material/Radio";
// import RadioGroup from "@mui/material/RadioGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Paper from "@mui/material/Paper";
// import FormControl from "@mui/material/FormControl";
// import axios from "axios";
// import { Select, MenuItem, Box } from "@mui/material";
// import { style } from "./LinkModal";
// import useJLStore from "../../useStore";
// import { baseUrl } from "../../App";

// import Modal from "@mui/material/Modal";

// const PostJobModal = ({ setJobsRefresh, handleClose, open }) => {
//   const zUser = useJLStore((state) => state.zUser);
//   // || {
//   //   id: 99999,
//   //   email: "guest@PostJobModal.link",
//   //   imageUrl: "https://www.gravatar.com/avatar/",
//   //   linkedinId: "fakeid",
//   // };
//   const setZJobs = useJLStore((state) => state.setZJobs);
//   const local_user_id = zUser.id;
//   const CardActionsStyled = styled(CardActions)({
//     display: "flex",
//     justifyContent: "center",
//   });
//   const CardContentStyled = styled(CardContent)({
//     padding: 0,
//     wrap: "wrap",
//   });
//   const TextFieldStyled = styled(TextField)({
//     margin: 4,
//   });

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     axios
//       .post(`${baseUrl}/jobs`, {
//         jobTitle: data.get("jobTitle"),
//         company: data.get("company"),
//         jobUrl: data.get("jobUrl"),
//         status: data.get("status"),
//         location: data.get("location"),
//         username: data.get("username"),
//         private: data.get("row-radio-buttons-group") === "true" ? true : false,
//         user_id: local_user_id || 99999,
//         description: data.get("description"),
//         caption: data.get("caption"),
//       })
//       .then((response) => {
//         console.log(response.data);
//         console.log("Job added successfully");
//         setZJobs();
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };
//   const handleRefresh = () => {
//     setTimeout(() => {
//       setJobsRefresh((prevState) => !prevState);
//     }, 500);
//   };
//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="parent-modal-title"
//       aria-describedby="parent-modal-description"
//     >
//       <Paper
//         elevation={3}
//         sx={{ maxWidth: 350, margin: 3, minHeight: 400, padding: 2, ...style }}
//         component="form"
//         onSubmit={handleSubmit}
//         required
//       >
//         <CardContentStyled>
//           <TextFieldStyled
//             margin="normal"
//             required
//             fullWidth
//             id="jobTitle"
//             label="Job Title"
//             name="jobTitle"
//             autoComplete="jobTitle"
//             size="small"
//           />
//           <TextFieldStyled
//             margin="normal"
//             required
//             fullWidth
//             id="company"
//             label="Company"
//             name="company"
//             autoComplete="company"
//             size="small"
//           />
//           <TextFieldStyled
//             margin="normal"
//             fullWidth
//             id="jobUrl"
//             label="Job URL"
//             name="jobUrl"
//             autoComplete="jobUrl"
//             size="small"
//           />
//           <TextFieldStyled
//             margin="normal"
//             required
//             fullWidth
//             id="description"
//             label="Description"
//             name="description"
//             autoComplete="description"
//             size="small"
//           />
//           <TextFieldStyled
//             margin="normal"
//             required
//             fullWidth
//             id="caption"
//             label="Caption"
//             name="caption"
//             autoComplete="caption"
//             size="small"
//           />
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//               margin: 1,
//             }}
//           >
//             <RadioGroup
//               row
//               aria-labelledby="demo-row-radio-buttons-group-label"
//               name="row-radio-buttons-group"
//               defaultValue={true}
//             >
//               <FormControlLabel
//                 value={true}
//                 control={<Radio />}
//                 label="Private"
//               />
//               <FormControlLabel
//                 value={false}
//                 control={<Radio />}
//                 label="Link"
//               />
//             </RadioGroup>
//             <Select
//               name="status"
//               defaultValue="Not Applied"
//               label="Status"
//               size="small"
//               width="50%"
//             >
//               <MenuItem value="Not Applied">Not Applied</MenuItem>
//               <MenuItem value="Applied">Applied</MenuItem>
//               <MenuItem value="Rejected">Rejected</MenuItem>
//               <MenuItem value="1st Interview">1st Interview</MenuItem>
//               <MenuItem value="Task">Task</MenuItem>
//               <MenuItem value="2nd Interview">2nd Interview</MenuItem>
//               <MenuItem value="Jobd">Jobd</MenuItem>
//             </Select>
//           </Box>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//               margin: 1,
//             }}
//           >
//             <TextFieldStyled
//               margin="normal"
//               required
//               width="50%"
//               id="location"
//               label="Location"
//               name="location"
//               autoComplete="location"
//               size="small"
//             />
//             <TextFieldStyled
//               margin="normal"
//               width="50%"
//               id="username"
//               label="Username"
//               name="username"
//               autoComplete="username"
//               size="small"
//             />
//           </Box>
//         </CardContentStyled>
//         <CardActionsStyled>
//           <Button
//             size="small"
//             justify="center"
//             type="submit"
//             onClick={handleRefresh}
//             sx={{
//               "&:hover": { backgroundColor: "primary.main", color: "white" },
//             }}
//           >
//             Add Job
//           </Button>
//         </CardActionsStyled>
//       </Paper>
//     </Modal>
//   );
// };

// export default PostJobModal;
