import useGetOthersTrips from "../hooks/useGetOthersTrips";
import useAuth from "../hooks/useAuth";
import {
  Box,
  Button,
  Grid2,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import DiscoverDialog from "../components/DiscoverDialog";
import LoadingSpinner from "../components/LoadingSpinner";

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
      <Box
        sx={{
          padding: isMobile ? "16px" : "32px",

          mt: isMobile ? 5 : 0,
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
          ).length > 0 && (
            <Box sx={!isMobile ? { flexGrow: 1, mt: 4 } : { flexGrow: 1 }}>
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
          )}
        {showContent && selectedTrip && (
          <DiscoverDialog
            setShowContent={setShowContent}
            selectedTrip={selectedTrip}
            isMobile={isMobile}
          />
        )}
      </Box>
    </>
  );
};

export default Discover;
