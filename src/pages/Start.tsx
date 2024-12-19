import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogIn = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ pb: 5, pt: 4 }}>
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
  );
};

export default Start;
