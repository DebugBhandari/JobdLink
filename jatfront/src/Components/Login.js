import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
//import { JLStoreContext } from "../App";
import JobdLanding from "../assets/JobdLanding.png";
import CardMedia from "@mui/material/CardMedia";
import { baseUrl } from "../App";

import LinkedInIcon from "@mui/icons-material/LinkedIn";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://debugbhandari.link">
        Debugbhandari.link
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignInSide() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  const handleLogin = async () => {
    window.open(`${baseUrl}/auth/linkedin`, "_self");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          height: "80dvh",
          width: "80dvw",
          display: "flex",
          flexDirection: "row",
          justifyContents: "center",
          margin: "auto",
          marginTop: "10dvh",
          "@media (max-width: 1000px)": {
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContents: "right",
            alignItems: "center",
            margin: "auto",
          }}
        >
          <img
            src={JobdLanding}
            alt="landingImage"
            style={{ width: "400px", height: "400px" }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContents: "center",

            padding: 4,

            margin: "auto",
            marginTop: 30,
            textAlign: "center",
            "@media (max-width: 1000px)": {
              marginTop: 6,
            },
          }}
        >
          <Typography
            component="h1"
            sx={{ fontWeight: "bold", fontSize: "36px" }}
          >
            Job Application Tracker
          </Typography>
          <br></br>
          <br></br>
          <Typography component="h1" variant="h5">
            For Jobseekers, By Jobseekers
          </Typography>

          <Box noValidate sx={{ mt: 1 }}>
            <Button
              onClick={handleLogin}
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: "white",
                color: "#2a2e45",
                "&:hover": {
                  bgcolor: "#2a2e45",
                  color: "white",
                },
              }}
            >
              Sign In With{" "}
              <LinkedInIcon sx={{ marginBottom: "4px", marginLeft: "4px" }} />
            </Button>

            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
