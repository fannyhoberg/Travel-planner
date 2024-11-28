import {
  Box,
  Button,
  Container,
  Grid2,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import AddNewTrip from "../components/AddNewTrip";
import { Link } from "react-router-dom";
import useGetTrips from "../hooks/useGetTrips";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [addNewTripDialog, setAddNewTripDialog] = useState(false);

  const { data: trips } = useGetTrips();

  console.log("data trips", trips);

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
        {trips && (
          <>
            {isMobile ? (
              <Box sx={{ flexGrow: 1 }}>
                <Grid2 container spacing={2} columns={8}>
                  {trips.map((trip) => (
                    <Grid2 size={8} key={trip._id}>
                      <Link
                        className="card-primary"
                        to={"/"}
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
                            {trip.title}
                          </Typography>
                        </Box>
                      </Link>
                    </Grid2>
                  ))}
                </Grid2>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1, mt: 4 }}>
                <Grid2 container spacing={6} columns={16}>
                  {trips.map((trip) => (
                    <Grid2 size={8} key={trip._id}>
                      <Link
                        className="card-primary"
                        to={"/"}
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
                            {trip.title}
                          </Typography>
                        </Box>
                      </Link>
                    </Grid2>
                  ))}
                </Grid2>
              </Box>
            )}
          </>
        )}
      </Container>

      {addNewTripDialog && (
        <AddNewTrip isMobile={isMobile} onClose={closeDialog} />
      )}
    </>
  );
};

export default Dashboard;
