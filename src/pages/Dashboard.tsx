import {
  Box,
  Button,
  Container,
  Grid2,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [addNewTripDialog, setAddNewTripDialog] = useState(false);

  const addNewTrip = () => {
    setAddNewTripDialog(true);
  };

  const closeDialog = () => {
    setAddNewTripDialog(false);
  };

  return (
    <>
      <Stack flex={"flex"} flexDirection={"row"}>
        <Typography variant="h3">My trips</Typography>
        {!isMobile && (
          <Button onClick={addNewTrip} className="btn-primary">
            New trip +
          </Button>
        )}
      </Stack>

      <Container maxWidth="md">
        {isMobile && (
          <>
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
                      <Typography variant="h4" color="#2a3132">
                        Paris 2025
                      </Typography>
                    </Box>
                  </Grid2>
                ))}
              </Grid2>
            </Box>
            {/* Add new trip dialog for mobile */}
            {addNewTripDialog && isMobile && (
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#F5F5F5",
                  zIndex: 1300,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Close button */}
                <Button
                  variant="text"
                  sx={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    padding: 0,
                    color: "black",
                  }}
                  onClick={closeDialog}
                >
                  X
                </Button>

                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  Where we going?
                </Typography>

                <Box sx={{ mt: 4, p: 5 }} component="form">
                  <TextField
                    label="Name your trip"
                    name="name"
                    type="name"
                    variant="standard"
                    required
                    fullWidth
                  />

                  <Button
                    variant="text"
                    type="submit"
                    className="btn-primary"
                    sx={{ mt: 4 }}
                    onClick={closeDialog}
                  >
                    Create
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Grid2 container spacing={6} columns={16}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Grid2 size={8} key={index}>
                  <Link
                    className="card-primary"
                    to={`/`}
                    style={{ textDecoration: "none" }}
                  >
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
                  </Link>
                </Grid2>
              ))}
            </Grid2>
          </Box>
        )}
        {addNewTripDialog && !isMobile && (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "30%",
              height: "40%",
              backgroundColor: "#F5F5F5",
              borderRadius: "10px",
              zIndex: 1300,
              boxShadow: 2,
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            {/* Close button */}
            <Button
              variant="text"
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                padding: 0,
                color: "black",
              }}
              onClick={closeDialog}
            >
              X
            </Button>

            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Where we going?
            </Typography>

            <Box sx={{ mt: 4, p: 5 }} component="form">
              <TextField
                label="Name your trip"
                name="name"
                type="name"
                variant="standard"
                required
                fullWidth
                // value={formData.email}
                // onChange={handleChange}
              />

              <Button
                variant="text"
                type="submit"
                className="btn-primary"
                sx={{ mt: 4 }}
                onClick={closeDialog}
              >
                Create
              </Button>
            </Box>
          </Box>
        )}
        {/* blurred background */}
        {addNewTripDialog && !isMobile && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(0.5px)",
              zIndex: 1200,
            }}
          />
        )}
      </Container>
    </>
  );
};

export default Dashboard;
