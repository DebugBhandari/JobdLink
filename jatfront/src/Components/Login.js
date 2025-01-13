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

const redirectUriConditional =
  process.env.REACT_APP_NODE_ENV === "development"
    ? "http://localhost:3001/auth/linkedin/callback"
    : "https://jobd.link/auth/linkedin/callback";

export default function SignInSide() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  //Redirect to Linkedin Auth
  const handleLogin = () => {
    const clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID; // Replace with your LinkedIn client ID
    const redirectUri = encodeURIComponent(redirectUriConditional);
    const state = "no_csrf_safer_internet"; // Use a secure random string
    const scope = encodeURIComponent("openid email profile w_member_social");

    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

    window.location.href = linkedInAuthUrl;
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          height: "80dvh",
          backgroundColor: "#f5f5f5",
          display: "flex",
          flexDirection: "row",
          justifyContents: "center",
          padding: "20px",
          alignItems: "center",
          margin: "auto",
          marginTop: "10dvh",
          marginBottom: "20dvh",
          "@media (max-width: 1000px)": {
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContents: "center",

            width: "50%",

            textAlign: "left",
            "@media (max-width: 1000px)": {
              marginTop: 6,
              width: "100%",
              alignItems: "center",
              textAlign: "center",
            },
          }}
        >
          <Typography
            component="h1"
            sx={{ fontWeight: "bold", fontSize: "40px" }}
          >
            Jobd.Link
          </Typography>
          <Typography component="h1" variant="h5" sx={{ color: "grey" }}>
            Job Application Tracker
          </Typography>
          <br></br>

          <Typography component="h1" variant="h5">
            For Jobseekers, By Jobseekers
          </Typography>

          <Box
            noValidate
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              justifyContents: "center",
              alignItems: "center",
            }}
          >
            <Button
              onClick={handleLogin}
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#2a2e45",
                color: "white",
                borderRadius: 10,
                width: "200px",
                "&:hover": {
                  backgroundColor: "white",
                  color: "#2a2e45",
                },
              }}
              className="linkedinLoginButton"
            >
              Sign In With{" "}
              <LinkedInIcon
                sx={{
                  marginBottom: "4px",
                  marginLeft: "4px",
                  color: "white",
                }}
                className="linkedinLoginIcon"
              />
            </Button>

            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>{" "}
        <Box
          sx={{
            display: "flex",
            justifyContents: "center",
            alignItems: "center",
            width: "50%",
            marginTop: "-140px",
            height: "60dvh",
            "@media (max-width: 1000px)": {
              width: "100%",
              marginTop: "0px",
            },
          }}
        >
          <img
            src={JobdLanding}
            alt="landingImage"
            style={{ width: "400px" }}
            className="loginMVPimage"
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
