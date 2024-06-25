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
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Link from "@mui/material/Link";
import { useSearchStore } from "../useStore";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 10,
  width: "40%",
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

const DEBOUNCE = 500;
export default function SearchAppBar() {
  const jobSearchQuery = useSearchStore((state) => state.jobSearchQuery);
  const updateJobSearchQuery = useSearchStore(
    (state) => state.updateJobSearchQuery
  );
  const [query, setQuery] = useState(jobSearchQuery);

  useEffect(() => {
    setQuery(jobSearchQuery);
  }, [jobSearchQuery]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateJobSearchQuery(query);
    }, DEBOUNCE);
    return () => clearTimeout(timeout);
  }, [query, updateJobSearchQuery]);

  return (
    <Box
      sx={{
        color: "secondary.main",
        alignItems: "center",
        position: "fixed",
        width: "100%",
        zIndex: 100,
      }}
    >
      <AppBar position="static" sx={{ minHeight: 40 }}>
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
                fontSize: 24,
                zIndex: 5,
                fontWeight: "bolder",
                backgroundColor: "#ff00009b",
                borderRadius: 10,
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
                fontSize: 24,
                fontWeight: "bolder",
                backgroundColor: "#388e3c",
                borderRadius: 10,
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
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => {
                e.stopPropagation();
                setQuery(e.target.value);
              }}
              value={query}
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
        </Toolbar>
      </AppBar>
    </Box>
  );
}
