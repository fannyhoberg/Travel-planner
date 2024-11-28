import { Route, Routes } from "react-router-dom";
import "./assets/scss/App.scss";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navigation from "./components/Navigation";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Start from "./pages/Start";
import TripPage from "./pages/TripPage";

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
          <Route path="/" element={<Start />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/trip/:id" element={<TripPage />} />
          </Route>
        </Routes>
      </div>
      {isMobile && <Navigation />}
    </>
  );
}

export default App;
