import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import FaceIcon from "@mui/icons-material/Face";
import MenuIcon from "@mui/icons-material/Menu";
import Logout from "@mui/icons-material/Logout";
import TripFormDialog from "./TripFormDialog";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { currentUser, logout } = useAuth();

  const closeDialog = () => {
    setOpenDialog(false);
    setAnchorEl(null);
  };

  const handleLogOut = async () => {
    await logout();
    console.log("You are signing out.");
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isMobile && currentUser && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 1300,
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Navigation menu"
              title="Navigation menu"
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
          >
            <MenuItem component={Link} to="/home">
              <HomeIcon sx={{ marginRight: 1 }} />
              Home
            </MenuItem>
            <MenuItem component={Link} to="/profile">
              <FaceIcon sx={{ marginRight: 1 }} />
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogOut}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Log out
            </MenuItem>
          </Menu>

          {openDialog && (
            <TripFormDialog isMobile={isMobile} closeDialog={closeDialog} />
          )}
        </>
      )}

      {!isMobile && (
        <AppBar
          sx={{
            backgroundColor: "#f5f3ed",
            width: "100%",
            boxShadow: "none",
          }}
          position="sticky"
        >
          <Toolbar>
            {currentUser && (
              <>
                <Typography
                  component={Link}
                  to="/home"
                  variant="h6"
                  sx={{
                    flexGrow: 1,
                    color: "black",
                    textDecoration: "none",
                    fontFamily: "Caveat, cursive",
                    fontWeight: 700,
                    fontSize: "3rem",
                  }}
                >
                  Vista
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Button component={Link} to="/home" sx={{ color: "black" }}>
                    My trips
                  </Button>
                  <Button
                    component={Link}
                    to="/profile"
                    sx={{ color: "black" }}
                  >
                    Profile
                  </Button>
                  {/* <Button sx={{ color: "black" }} onClick={handleLogOut}>
                    Log out
                  </Button> */}
                </Box>
              </>
            )}
          </Toolbar>
        </AppBar>
      )}
    </>
  );
};

export default Navigation;
