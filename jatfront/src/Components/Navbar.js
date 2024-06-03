import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Link from "@mui/material/Link";
import Arrows from "../assets/jobdlink.png";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "white",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function SearchAppBar() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        minWidth: "100%",
        color: "secondary.main",
        alignItems: "center",
      }}
    >
      <AppBar position="static" sx={{ minHeight: 80 }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            className="jobd"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
              textAlign: "left",
              justifyContent: "left",
              zIndex: 5,
              fontFamily: "monaco",
              fontWeight: "boldest",
              color: "white",
              fontSize: 30,
              marginTop: 1,
            }}
          >
            <Link
              href="/jobs"
              variant="body"
              style={{
                textDecoration: "none",
                fontSize: 40,
                zIndex: 5,
                fontWeight: "bolder",
                backgroundColor: "#ff00009b",
                borderRadius: 100,
                maxHeight: 50,
                padding: 5,
                color: "white",
              }}
            >
              JOBD.
            </Link>

            <Link
              href="/"
              variant="body"
              style={{
                textDecoration: "none",
                fontSize: 40,
                fontWeight: "bolder",
                backgroundColor: "#00ff159b",
                borderRadius: 100,
                maxHeight: 50,
                padding: 5,
                color: "white",
              }}
            >
              LINK
            </Link>
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <Link
              href="/login"
              variant="body"
              style={{ textDecoration: "none", color: "white" }}
            >
              <MenuIcon />
            </Link>
          </IconButton>
          {/* <img
            src={Arrows}
            alt="Arrows"
            loading="lazy"
            className="imgArrows"
            style={{
              height: 130,
              width: 220,
              position: "absolute",
              top: -20.2,
              left: "28.7vw",
              zIndex: 1,
            }}
          /> */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
