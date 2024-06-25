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
import { AuthContext } from "../App";
import JobdLanding from "../assets/JobdLanding.png";
import CardMedia from "@mui/material/CardMedia";
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
  const { setAuthData } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const location = useLocation();

  const handleLogin = async () => {
    window.open("http://localhost:3001/auth/google", "_self");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          width: "100vw",
          height: "80vh",
          display: "flex",
          flexDirection: "row",
          justifyContents: "center",
        }}
      >
        <Box
          sx={{
            width: "30%",
            height: "80vh",
            display: "flex",
            justifyContents: "right",
            alignItems: "center",
            margin: 10,
          }}
        >
          <img
            src={JobdLanding}
            alt="landingImage"
            style={{ width: "360px", height: "360px" }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContents: "center",
            marginTop: 30,
            marginRight: 10,
            width: "40%",
            padding: 4,
            height: "100vh",
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
              sx={{ mt: 3, mb: 2, bgcolor: "success.main" }}
            >
              Sign In With Google
            </Button>
            <Grid container></Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
