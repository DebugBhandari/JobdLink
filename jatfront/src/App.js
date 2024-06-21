import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import "./App.css";
import Register from "./Components/Register"; // Import the 'Register' component
import DashBoard from "./Components/DashBoard"; // Import the 'DashBoard' component
import Jobs from "./Components/Jobs";
import Navbar from "./Components/Navbar";
import { Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login from "./Components/Login";
import Links from "./Components/Links";

export const AuthContext = React.createContext({
  authData: {},
  setAuthData: () => {},
});

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

function App() {
  const [authData, setAuthData] = React.useState();
  const value = { authData, setAuthData };
  return (
    <ThemeProvider theme={theme}>
      <Container disableGutters maxWidth={false}>
        <AuthContext.Provider value={value}>
          <Navbar />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Links />} />
              <Route
                path="/login"
                setAuthData={setAuthData}
                element={<Login render={(params) => ({ ...params })} />}
              />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </Container>
    </ThemeProvider>
  );
}

export default App;
