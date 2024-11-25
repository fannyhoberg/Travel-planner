import { Box, Button, Container, Stack, Typography } from "@mui/material";

const Home = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h1" gutterBottom>
        VISTA
      </Typography>
      <Box>
        <Stack spacing={4}>
          <Button className="btn-primary" variant="contained">
            Log in
          </Button>
          <Button className="btn-secondary" variant="text">
            Create account
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Home;
