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
import { LoadScriptNext } from "@react-google-maps/api";
import ProfilePage from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const google_api_key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <>
      {!isMobile && <Navigation />}

      <div id="App">
        <LoadScriptNext
          googleMapsApiKey={google_api_key}
          libraries={["places"]}
        >
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
                  pb: 4,
                }}
              >
                <Typography variant="h6" sx={{ color: "black" }}>
                  Vista
                </Typography>
              </Box>
            )}

            <Routes>
              <Route path="/" element={<Start />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route element={<ProtectedRoutes />}>
                <Route path="/home" element={<Dashboard />} />
                <Route path="/trip/:id" element={<TripPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Routes>
            {isMobile && <Navigation />}
          </>
        </LoadScriptNext>
      </div>
    </>
  );
}

export default App;
