import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { createContext, useState } from "react";
import "./App.css";
import "./index.css";
import Register from "./Components/Register"; // Import the 'Register' component
import DashBoard from "./Components/DashBoard"; // Import the 'DashBoard' component
import Jobs from "./Components/Jobs";
import Navbar from "./Components/Navbar";
import { Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login from "./Components/Login";
import Links from "./Components/Links";
import LinkView from "./Components/LinkView";
export const baseUrl =
  process.env.REACT_APP_NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://jobd.link";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2A2E45",
      light: "#7A542E",
      dark: "#9E8576",
      contrastText: "#47008F",
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#A499BE",
      light: "#9BA2FF",

      // dark: will be calculated from palette.secondary.main,
    },
  },
});

// export const JLStoreContext = createContext({
//   contextData: {},
//   setContextData: () => {},
// });

function App() {
  // const [contextData, setContextData] = useState({
  //   zUser: {},

  //   zJobs: [],

  //   zJobComments: [],

  //   zJobLikes: [],
  // });
  // const value = { contextData, setContextData };
  // console.log("contextData", contextData);

  return (
    <ThemeProvider theme={theme}>
      <div className="mainAppDiv">
        <BrowserRouter>
          <Navbar />
          <div className="routesContainer">
            <Routes>
              <Route path="/" element={<Links />} />
              <Route
                path="/login"
                element={<Login render={(params) => ({ ...params })} />}
              />
              <Route path="/register" element={<Register />} />
              <Route path="/JAT" element={<Jobs />} />
              <Route path="/links/:id" element={<LinkView />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
