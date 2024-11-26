import {
  Box,
  Container,
  Grid2,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Container maxWidth="sm">
      {isMobile && (
        <Box sx={{ flexGrow: 1 }}>
          <Grid2 container spacing={2} columns={8}>
            {Array.from({ length: 7 }).map((_, index) => (
              <Grid2 size={8} key={index}>
                <Box
                  sx={{
                    backgroundColor: "#ede3d6",
                    height: 150,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h3" color="#2a3132">
                    Paris 2025
                  </Typography>
                </Box>
              </Grid2>
            ))}{" "}
          </Grid2>
        </Box>
      )}
      <Box sx={{ flexGrow: 1, mt: 4 }}>
        <Grid2 container spacing={4} columns={12}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid2 size={6} key={index}>
              <Box
                sx={{
                  backgroundColor: "#ede3d6",
                  height: 150,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  borderRadius: 3,
                }}
              >
                <Typography variant="h4" color="#2a3132">
                  Paris 2025
                </Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Container>
  );
};

export default Dashboard;
