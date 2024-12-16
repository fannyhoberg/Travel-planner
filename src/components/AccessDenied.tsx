import { Box, Container, Typography } from "@mui/material";
import BackButton from "./BackButton";

const AccessDenied = () => {
  return (
    <Container sx={{ mb: "10vh" }} maxWidth={"md"}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          mt: 4,
        }}
      >
        <Typography>You don't have access to view this trip!</Typography>
      </Box>
      <BackButton />
    </Container>
  );
};

export default AccessDenied;
