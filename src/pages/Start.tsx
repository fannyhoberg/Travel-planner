import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BackgroundPic from "../assets/images/StartPage.png";

const Start = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogIn = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${BackgroundPic})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        padding: 0,
        margin: 0,
      }}
    >
      <Container maxWidth="sm">
        <Box>
          <Typography
            variant="h1"
            sx={{
              flexGrow: 1,
              color: "black",
              textDecoration: "none",
              fontFamily: "Caveat, cursive",
              fontWeight: 900,
              fontSize: "7rem",
            }}
            gutterBottom
          >
            VISTA
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack spacing={4}>
            <Button
              onClick={handleSignUp}
              type="submit"
              className="btn-primary"
              variant="contained"
            >
              Create account
            </Button>
            <Button
              onClick={handleLogIn}
              className="btn-secondary"
              variant="outlined"
            >
              Log in
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Start;
