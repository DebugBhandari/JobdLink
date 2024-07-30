import { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import InputAdornment from "@mui/material/InputAdornment";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Link from "@mui/material/Link";
import useJLStore from "../useStore";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";

import Avatar from "@mui/material/Avatar";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginLeft: 10,
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
  color: "black",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "black",
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

const DEBOUNCE = 500;
export default function SearchAppBar() {
  const { jobSearchQuery, updateJobSearchQuery, zUser } = useJLStore(
    (state) => ({
      jobSearchQuery: state.jobSearchQuery,
      updateJobSearchQuery: state.updateJobSearchQuery,
      zUser: state.zUser,
    })
  );

  const location = useLocation();
  const params = location.pathname;

  const logoStyleJobd = {
    textDecoration: "none",
    fontSize: params === "/JAT" ? 24 : 16,
    zIndex: 5,
    fontWeight: params === "/JAT" ? 900 : 700,
    borderRadius: 10,
    maxHeight: 50,
    px: 0,
    //color: "#ff00009b",
    //color: params === "/JAT" ? "#fa0707" : "#ff00009b",
  };
  const logoStyleLink = {
    textDecoration: "none",
    fontSize: params === "/" ? 24 : 16,
    fontWeight: params === "/" ? 900 : 700,
    borderRadius: 10,
    //color: "#388e3c",
    px: 0,
    //color: params === "/" ? "#00f208" : "#388e3c",
  };
  // const [query, setQuery] = useState(jobSearchQuery);
  // useEffect(() => {
  //   setQuery(jobSearchQuery);
  // }, [jobSearchQuery]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     updateJobSearchQuery(query);
  //   }, DEBOUNCE);
  //   return () => clearTimeout(timeout);
  // }, [query, updateJobSearchQuery]);

  return (
    <div className="navDiv">
      <div className="navTitle">
        <Typography
          variant="h6"
          noWrap
          className="jobd"
          sx={{
            flexGrow: 1,

            textAlign: "left",
            justifyContent: "left",
            zIndex: 5,
            fontWeight: 900,
            color: "white",
            fontSize: 30,
            marginTop: 1,
            fontFamily: "Roboto Slab",
          }}
        >
          {" "}
          <Link
            href="/JAT"
            variant="body"
            // style={{
            //   textDecoration: "none",
            //   fontSize: 24,
            //   zIndex: 5,
            //   fontWeight: "bolder",
            //   borderRadius: 10,
            //   maxHeight: 50,
            //   padding: 5,
            //   color: "#ff00009b",
            // }}
            sx={{ ...logoStyleJobd }}
          >
            JOBD.
          </Link>{" "}
          <Link
            href="/"
            variant="body"
            // style={{
            //   textDecoration: "none",
            //   fontSize: 24,
            //   fontWeight: "bolder",
            //   borderRadius: 10,
            //   padding: 5,
            //   color: "#388e3c",
            // }}
            sx={{ ...logoStyleLink }}
          >
            LINK
          </Link>{" "}
        </Typography>
      </div>
      <div className="navMisc">
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
        >
          {!zUser.imageUrl ? (
            <Link
              href="/login"
              variant="body"
              style={{ textDecoration: "none", color: "black" }}
            >
              <LoginIcon />
            </Link>
          ) : (
            <Link
              href={`/profile/${zUser.id}`}
              variant="body"
              // style={{
              //   textDecoration: "none",
              //   fontSize: 24,
              //   fontWeight: "bolder",
              //   borderRadius: 10,
              //   padding: 5,
              //   color: "#388e3c",
              // }}
              sx={{ ...logoStyleLink }}
            >
              <Avatar
                alt={zUser.name}
                src={zUser.imageUrl}
                sx={{ width: 32, height: 32 }}
              />
            </Link>
          )}
        </IconButton>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => {
              e.stopPropagation();
              updateJobSearchQuery(e.target.value);
            }}
            value={jobSearchQuery}
            endAdornment={
              !!jobSearchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search query"
                    onClick={() => updateJobSearchQuery("")}
                    edge="end"
                    sx={{ mr: 0, color: "white" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              )
            }
          />
        </Search>
      </div>
    </div>
  );
}
