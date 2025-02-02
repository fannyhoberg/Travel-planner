import useGetOthersTrips from "../hooks/useGetOthersTrips";
import useAuth from "../hooks/useAuth";
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
import DiscoverDialog from "../components/DiscoverDialog";
import LoadingSpinner from "../components/LoadingSpinner";
import BackButton from "../components/BackButton";

const Discover = () => {
  const [showContent, setShowContent] = useState(false);
  const [tripId, setTripId] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { currentUser } = useAuth();
  const { data: trips, isLoading } = useGetOthersTrips(currentUser?.uid);

  const handleShowContent = (id: string) => {
    setTripId(id);
    setShowContent(true);
  };

  const selectedTrip = trips?.find((trip) => trip._id === tripId);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <BackButton />
      <Container
        sx={isMobile ? { mb: "10vh", mt: 6 } : { mb: "10vh" }}
        maxWidth={isMobile ? "sm" : "lg"}
      >
        <Box
          sx={{
            padding: isMobile ? "16px" : "32px",
            pt: 5,
          }}
        >
          <Box sx={{ pb: 4 }}>
            <Typography variant="h1" sx={{ marginBottom: "16px" }}>
              Discover
            </Typography>
            <Typography variant="h3">
              View other users trips and get inspiration for your trip
            </Typography>
          </Box>
          {trips &&
          trips.filter((trip) =>
            trip.lists?.some((list) => list.items && list.items.length > 0)
          ).length > 0 ? (
            <Box sx={{ flexGrow: 1, mt: 4 }}>
              <Grid2
                container
                spacing={!isMobile ? 6 : 2}
                columns={!isMobile ? 16 : 8}
              >
                {trips
                  .filter((trip) =>
                    trip.lists?.some(
                      (list) => list.items && list.items.length > 0
                    )
                  )
                  .map((trip) => (
                    <Grid2 size={8} key={trip._id}>
                      <Box
                        sx={{
                          border: "1px solid #835d23",
                          borderRadius: 2,
                          backgroundColor: "white",
                        }}
                      >
                        <Stack spacing={2} sx={{ p: 2 }}>
                          <Box>
                            <Typography variant="h2" color="#2a3132">
                              {trip.title}
                            </Typography>
                            <Button
                              variant="text"
                              sx={{ color: "#835d23" }}
                              aria-label="Show details"
                              title="Show details"
                              onClick={() => {
                                handleShowContent(trip._id);
                              }}
                            >
                              Show details
                            </Button>
                          </Box>
                        </Stack>
                      </Box>
                    </Grid2>
                  ))}
              </Grid2>
            </Box>
          ) : (
            <Box sx={!isMobile ? { mt: 4 } : null}>
              <Typography>No trips to view here yet..</Typography>
            </Box>
          )}
          {showContent && selectedTrip && (
            <DiscoverDialog
              setShowContent={setShowContent}
              selectedTrip={selectedTrip}
              isMobile={isMobile}
            />
          )}
        </Box>
      </Container>
    </>
  );
};

export default Discover;
