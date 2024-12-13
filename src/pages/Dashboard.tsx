import {
  Box,
  Button,
  Container,
  Grid2,
  IconButton,
  MenuItem,
  Popover,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import AddNewTrip from "../components/AddNewTrip";
import { Link } from "react-router-dom";
import useGetTrips from "../hooks/useGetTrips";
import useAuth from "../hooks/useAuth";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import ConfirmationModal from "../components/ConfirmationModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [addNewTripDialog, setAddNewTripDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);

  const { currentUser } = useAuth();

  const { data: trips, isLoading } = useGetTrips(currentUser?.uid);

  console.log("data trips", trips);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, trip: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedTrip(trip);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!selectedTripId) return;
    try {
      const tripDocRef = doc(db, "trips", tripId as string);
      await deleteDoc(tripDocRef);
      setShowDeleteModal(false);
      console.log(`Trip with ID: ${tripId} has been deleted successfully`);
    } catch (err) {
      console.error("Error deleting trip:", err);
    }
  };

  const addNewTrip = () => {
    setAddNewTripDialog(true);
  };

  const closeDialog = () => {
    setAddNewTripDialog(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "left",
          justifyContent: "space-between",
          padding: "8px",
        }}
      >
        <Typography variant="h3">My trips</Typography>
        {!isMobile && (
          <Button onClick={addNewTrip} className="btn-primary">
            New trip +
          </Button>
        )}
      </Box>

      <Container maxWidth="md">
        {trips && (
          <>
            {isLoading && <div>Loading...</div>}
            <Box sx={!isMobile ? { flexGrow: 1, mt: 4 } : { flexGrow: 1 }}>
              <Grid2
                container
                spacing={!isMobile ? 6 : 2}
                columns={!isMobile ? 16 : 8}
              >
                {trips.map((trip) => (
                  <Grid2 size={8} key={trip._id}>
                    <Box
                      sx={{
                        backgroundColor: "#ede3d6",
                        height: 150,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        borderRadius: 3,
                        position: "relative",
                      }}
                    >
                      <IconButton
                        onClick={(e) => handleOpenMenu(e, trip)}
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
                      >
                        <Box>
                          <MenuItem
                            onClick={() => {
                              console.log("Editing trip:", selectedTrip);
                              handleCloseMenu();
                            }}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setSelectedTripId(selectedTrip._id);
                              setShowDeleteModal(true);
                              handleCloseMenu();
                            }}
                          >
                            Delete
                          </MenuItem>
                        </Box>
                      </Popover>
                      <ConfirmationModal
                        onOpen={showDeleteModal}
                        onConfirm={() => handleDeleteTrip(trip._id)}
                        onCancel={() => setShowDeleteModal(false)}
                      >
                        Sure you want to delete this trip?
                      </ConfirmationModal>
                      <Link
                        className="card-primary"
                        to={`/trip/${trip._id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Typography variant="h4" color="#2a3132">
                          {trip.title}
                        </Typography>
                      </Link>
                    </Box>
                  </Grid2>
                ))}
              </Grid2>
            </Box>
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
