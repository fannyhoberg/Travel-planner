import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h1" gutterBottom>
        VISTA
      </Typography>
      <Box>
        <Stack spacing={4}>
          <Button
            onClick={handleSignUp}
            className="btn-primary"
            variant="contained"
          >
            Create account
          </Button>
          <Button className="btn-secondary" variant="outlined">
            Log in
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Home;
