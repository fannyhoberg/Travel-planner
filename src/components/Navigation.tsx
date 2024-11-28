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
import AddNewTrip from "./AddNewTrip";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  //   const [value, setValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const addNewTrip = () => {
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
  };

  const handleLogOut = async () => {
    await logout();
    console.log("You are signing out.");
    await new Promise((r) => setTimeout(r, 1500));
    navigate("/login");
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
            >
              <BottomNavigationAction aria-label="Home" icon={<HomeIcon />} />
              <BottomNavigationAction
                aria-label="Add new Trip"
                icon={<AddIcon />}
                onClick={addNewTrip}
              />
              <BottomNavigationAction
                aria-label="Profile"
                icon={<FaceIcon />}
              />
            </BottomNavigation>
          </Box>
          {openDialog && (
            <AddNewTrip isMobile={isMobile} onClose={closeDialog} />
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
            <Typography variant="h6" sx={{ flexGrow: 1, color: "black" }}>
              Vista
            </Typography>
            {currentUser && (
              <>
                <Button sx={{ color: "black" }}>My trips</Button>
                <Button sx={{ color: "black" }}>
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
