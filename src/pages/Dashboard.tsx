import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
  MenuItem,
  Popover,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import AddNewTrip from "../components/AddNewTrip";
import { Link } from "react-router-dom";
import useGetTrips from "../hooks/useGetTrips";
import useAuth from "../hooks/useAuth";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import ConfirmationModal from "../components/ConfirmationModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TripTextData } from "../types/trip";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [addNewTripDialog, setAddNewTripDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [tripName, setTripName] = useState("");
  const [updateTripDialog, setUpdateTripDialog] = useState(false);

  const { currentUser } = useAuth();

  const { data: trips, isLoading } = useGetTrips(currentUser?.uid);

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

  const handleEditTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: TripTextData = { title: tripName };

    console.log("data", data);

    try {
      const tripDocRef = doc(db, "trips", selectedTripId as string);

      await updateDoc(tripDocRef, {
        title: data.title,
      });
      setUpdateTripDialog(false);
      console.log(
        `Trip with ID: ${selectedTripId} has been updated with title: ${data.title}`
      );
    } catch (err) {
      console.error("Error updating trip:", err);
    }
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
                            tabIndex={1}
                            aria-label="Edit trip"
                            title="Edit trip"
                            onClick={() => {
                              console.log("Editing trip:", selectedTrip);
                              setSelectedTripId(selectedTrip._id);
                              setTripName(trip.title);
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

      {updateTripDialog && (
        <Dialog open={true} onClose={closeDialog}>
          <DialogTitle>Update trip</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 4 }} component="form" onSubmit={handleEditTrip}>
              <TextField
                label="List Name"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                variant="standard"
                required
                sx={{
                  maxWidth: isMobile ? "450px" : "600px",
                  width: "100%",
                  mb: 3,
                }}
              />
              <Button
                variant="text"
                type="submit"
                className="btn-primary"
                sx={{ mt: 4 }}
              >
                Save
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default Dashboard;
