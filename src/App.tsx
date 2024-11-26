import { Route, Routes } from "react-router-dom";
import "./assets/scss/App.scss";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navigation from "./components/Navigation";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <>
      {isMobile && (
        <Box
          sx={{
            position: "relative",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1300,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "black" }}>
            Vista
          </Typography>
        </Box>
      )}

      {!isMobile && <Navigation />}
      <div id="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Dashboard />} />
        </Routes>
      </div>
      {isMobile && <Navigation />}
    </>
  );
}

export default App;
