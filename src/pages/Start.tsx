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
      <Typography variant="h1" gutterBottom>
        VISTA
      </Typography>
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
