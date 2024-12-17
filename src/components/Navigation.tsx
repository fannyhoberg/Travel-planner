import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import FaceIcon from "@mui/icons-material/Face";
import TripFormDialog from "./TripFormDialog";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [openDialog, setOpenDialog] = useState(false);

  const { currentUser, logout } = useAuth();

  const addNewTrip = () => {
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
  };

  const handleLogOut = async () => {
    await logout();
    console.log("You are signing out.");
  };

  return (
    <>
      {isMobile && currentUser && (
        <>
          <Box
            sx={{
              width: "100%",
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <BottomNavigation
              showLabels
              //   value={value}
              //   onChange={(newValue) => {
              //     setValue(newValue);
              //   }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BottomNavigation>
                <Link
                  to="/home"
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <BottomNavigationAction
                    aria-label="Home"
                    icon={<HomeIcon />}
                  />
                </Link>
              </BottomNavigation>{" "}
              <BottomNavigationAction
                aria-label="Add new Trip"
                icon={<AddIcon />}
                onClick={addNewTrip}
                sx={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              />
              <Link
                to="/profile"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BottomNavigationAction
                  aria-label="Profile"
                  icon={<FaceIcon />}
                />
              </Link>
            </BottomNavigation>
          </Box>
          {openDialog && (
            <TripFormDialog isMobile={isMobile} closeDialog={closeDialog} />
          )}
        </>
      )}
      {!isMobile && (
        <AppBar
          sx={{
            backgroundColor: "white",
            width: "100%",
            boxShadow: "none",
          }}
          position="sticky"
        >
          <Toolbar>
            <Typography
              component={Link}
              to="/home"
              variant="h6"
              sx={{ flexGrow: 1, color: "black" }}
            >
              Vista
            </Typography>
            {currentUser && (
              <>
                <Button component={Link} to="/home" sx={{ color: "black" }}>
                  My trips
                </Button>
                <Button component={Link} to="/profile" sx={{ color: "black" }}>
                  <FaceIcon />
                </Button>
                <Button sx={{ color: "black" }} onClick={handleLogOut}>
                  Log out
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      )}
    </>
  );
};

export default Navigation;
