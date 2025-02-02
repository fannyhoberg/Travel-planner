import {
  Box,
  Button,
  Container,
  Divider,
  Grid2,
  IconButton,
  MenuItem,
  Popover,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import TripFormDialog from "../components/TripFormDialog";
import { Link } from "react-router-dom";
import useGetMyTrips from "../hooks/useGetMyTrips";
import useAuth from "../hooks/useAuth";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import ConfirmationModal from "../components/ConfirmationModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Trip } from "../types/trip";
import { FirebaseError } from "firebase/app";
import LoadingSpinner from "../components/LoadingSpinner";
import NoTrips from "../assets/images/addtrip2.png";
import useGetSharedTrips from "../hooks/userGetSharedTrips";

const Dashboard = () => {
  const [addNewTripDialog, setAddNewTripDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [updateTripDialog, setUpdateTripDialog] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const { currentUser } = useAuth();

  const { data: trips, isLoading } = useGetMyTrips(currentUser?.uid);
  const { data: sharedTrips, isLoading: loadingSharedTrips } =
    useGetSharedTrips(currentUser?.uid);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, trip: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedTrip(trip);
    setSelectedTripId(trip._id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteTrip = async () => {
    if (!selectedTripId) return;
    setLoading(true);
    try {
      const tripDocRef = doc(db, "trips", selectedTripId as string);
      await deleteDoc(tripDocRef);
      setShowDeleteModal(false);
    } catch (err) {
      if (err instanceof FirebaseError) {
        setIsError(err.message);
      } else if (err instanceof Error) {
        setIsError(err.message);
      } else {
        setIsError("Could not add delete trip, something went wrong..");
      }
    }
    setLoading(false);
  };

  const addNewTrip = () => {
    setAddNewTripDialog(true);
  };

  const closeDialog = () => {
    setAddNewTripDialog(false);
    setUpdateTripDialog(false);
  };

  return (
    <>
      <Box
        sx={{
          padding: isMobile ? "16px" : "32px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "center" : "flex-start",
          justifyContent: "space-between",
          mt: isMobile ? 5 : 3,
        }}
      >
        <Typography variant="h1" sx={{ marginBottom: isMobile ? "16px" : "0" }}>
          My trips
        </Typography>

        <Box sx={{ display: isMobile ? "block" : "none", mt: 2, mb: 2 }}>
          <Button
            onClick={addNewTrip}
            className="btn-primary"
            aria-label="Add new trip"
            title="Add new trip"
          >
            New trip
          </Button>
        </Box>

        {!isMobile && (
          <Button
            onClick={addNewTrip}
            className="btn-primary"
            aria-label="Add new trip"
            title="Add new trip"
          >
            New trip
          </Button>
        )}
      </Box>

      <Container maxWidth="md" sx={{ mb: 4, p: 4 }}>
        {isLoading && <LoadingSpinner />}
        {loading && <LoadingSpinner />}

        {isError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {isError}
          </Typography>
        )}

        {trips && (
          <>
            <Box
              sx={
                !isMobile ? { flexGrow: 1, mt: 4 } : { flexGrow: 1, padding: 4 }
              }
            >
              <Grid2
                container
                spacing={!isMobile ? 6 : 2}
                columns={!isMobile ? 16 : 8}
              >
                {trips.map((trip) => (
                  <Grid2 size={8} key={trip._id}>
                    <Link
                      to={`/trip/${trip._id}`}
                      style={{ textDecoration: "none" }}
                      title="Go to trip page"
                      aria-label="Go to trip page"
                    >
                      <Box
                        sx={{
                          backgroundColor: "white",
                          height: 150,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          borderRadius: 3,
                          position: "relative",
                          transition:
                            "transform 0.5s ease, background-color 0.5s ease",
                          "&:hover": {
                            backgroundColor: "#fceb9b",
                            transform: "scale(1.02)",
                          },
                        }}
                      >
                        <Typography variant="h2" color="#2a3132">
                          {trip.title}
                        </Typography>

                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleOpenMenu(e, trip);
                          }}
                          size="small"
                          title="More actions"
                          aria-label="More actions"
                          sx={{ position: "absolute", top: 8, right: 8 }}
                        >
                          <MoreVertIcon />
                        </IconButton>

                        <Popover
                          open={Boolean(anchorEl)}
                          anchorEl={anchorEl}
                          onClose={handleCloseMenu}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Box>
                            <MenuItem
                              tabIndex={1}
                              aria-label="Edit trip"
                              title="Edit trip"
                              onClick={() => {
                                handleCloseMenu();
                                setUpdateTripDialog(true);
                              }}
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              tabIndex={1}
                              aria-label="Delete trip"
                              title="Delete trip"
                              onClick={() => {
                                setShowDeleteModal(true);
                                handleCloseMenu();
                              }}
                            >
                              Delete
                            </MenuItem>
                          </Box>
                        </Popover>
                      </Box>
                    </Link>
                  </Grid2>
                ))}
              </Grid2>
            </Box>
          </>
        )}
        {trips && trips.length < 1 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              mb: 5,
              overflow: "hidden",
            }}
          >
            <Typography variant="h4">
              Add your first trip and start planning!
            </Typography>

            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <img
                src={NoTrips}
                alt="404 Not Found"
                style={{
                  width: isMobile ? "100%" : "70%",
                  height: isMobile ? "100%" : "70%",
                  maxHeight: "100vh",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </Box>
          </Box>
        )}
      </Container>
      {sharedTrips?.length > 0 && (
        <>
          <Divider />

          <Box
            sx={{
              padding: isMobile ? "16px" : "32px",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "center" : "flex-start",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Typography
              variant="h1"
              sx={{ marginBottom: isMobile ? "16px" : "0" }}
            >
              Shared trips
            </Typography>
          </Box>
          <Container
            maxWidth="md"
            sx={isMobile ? { mb: "10vh", mt: 6 } : { mb: "10vh" }}
          >
            <Box
              sx={
                !isMobile ? { flexGrow: 1, mt: 4 } : { flexGrow: 1, padding: 4 }
              }
            >
              {loadingSharedTrips && <LoadingSpinner />}
              <Grid2
                container
                spacing={!isMobile ? 6 : 2}
                columns={!isMobile ? 16 : 8}
              >
                {sharedTrips.map((trip) => (
                  <Grid2 size={8} key={trip._id}>
                    <Link
                      to={`/trip/${trip._id}`}
                      style={{ textDecoration: "none" }}
                      title="Go to trip page"
                      aria-label="Go to trip page"
                    >
                      <Box
                        sx={{
                          backgroundColor: "white",
                          height: 150,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          borderRadius: 3,
                          position: "relative",
                          transition:
                            "transform 0.5s ease, background-color 0.5s ease",
                          "&:hover": {
                            backgroundColor: "#fceb9b",
                            transform: "scale(1.02)",
                          },
                        }}
                      >
                        <Typography
                          variant="h2"
                          color="#2a3132"
                          sx={{ marginBottom: 1 }}
                        >
                          {trip.title}
                        </Typography>
                        <Typography variant="body2" color="#2a3132">
                          owner: {trip.owner}
                        </Typography>
                      </Box>
                    </Link>
                  </Grid2>
                ))}
              </Grid2>
            </Box>
          </Container>
        </>
      )}

      {addNewTripDialog && (
        <TripFormDialog isMobile={isMobile} closeDialog={closeDialog} />
      )}

      {updateTripDialog && (
        <TripFormDialog
          id={selectedTrip?._id}
          initialValue={selectedTrip?.title}
          isMobile={isMobile}
          closeDialog={closeDialog}
        />
      )}

      {showDeleteModal && (
        <ConfirmationModal
          onOpen={showDeleteModal}
          onConfirm={() => handleDeleteTrip()}
          onCancel={() => setShowDeleteModal(false)}
        >
          Sure you want to delete this trip?
        </ConfirmationModal>
      )}
    </>
  );
};

export default Dashboard;
