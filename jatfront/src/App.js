import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { createContext, useState } from "react";
import "./App.css";
import "./index.css";
import Register from "./Components/Register"; // Import the 'Register' component
import DashBoard from "./Components/DashBoard"; // Import the 'DashBoard' component
import Jobs from "./Components/Jobs";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login from "./Components/Login";
import Links from "./Components/Links";
import LinkView from "./Components/LinkView";
import EditProfile from "./Components/EditProfile";
import CreateJobComp from "./Components/CreateJobComp";
import EditJobComp from "./Components/EditJobComp";
import TailorCV from "./Components/TailorCV";
import AiPlayground from "./Components/AiPlayground";
import useJLStore from "./useStore";

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
              <Route path="/" element={<Links key="1" />} />
              <Route
                path="/login"
                element={<Login render={(params) => ({ ...params })} />}
              />
              <Route path="/register" element={<Register key="2" />} />

              <Route path="/JAT" element={<Jobs key="3" />} />

              <Route path="/links/:id" element={<LinkView key="4" />} />
              <Route path="/userProfile/:id" element={<DashBoard key="5" />} />
              <Route
                path="/editProfile/:id"
                element={<EditProfile key="6" />}
              />
              <Route path="/createJob" element={<CreateJobComp />} />
              <Route path="/editJob/:id" element={<EditJobComp />} />
              {/* <Route path="/editJob/:id" element={<EditJobPage />} /> */}
              <Route path="/tailor" element={<TailorCV />} />
              <Route path="/ai-chat" element={<AiPlayground />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
