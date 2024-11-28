import { Link, useParams } from "react-router-dom";
import useGetTrip from "../hooks/useGetTrip";
import {
  Box,
  Button,
  ClickAwayListener,
  Container,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useState } from "react";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const TripPage = () => {
  const [addNewListDialog, setAddNewTripDialog] = useState(false);
  const [listName, setListName] = useState<string>("");

  const { id } = useParams();

  const { data: trip, isError, isLoading } = useGetTrip(id);
  console.log("data trip", trip);

  const addNewList = () => {
    setAddNewTripDialog(true);
  };

  const handleSubmitNewList = async (e: React.FormEvent) => {
    console.log("Clicked on add new list");
    e.preventDefault();
    if (!listName.trim()) return;

    try {
      const tripDocRef = doc(db, "trips", id as string);

      console.log("listName", listName);

      await updateDoc(tripDocRef, {
        lists: arrayUnion({ name: listName, items: [] }),
      });
      setListName("");
      setAddNewTripDialog(false);
    } catch (error) {
      console.error("Failed to add list:", error);
    }
  };

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Something went wrong</div>}

      {!isLoading && !isError && (
        <Container maxWidth="sm">
          <Typography variant="h3">{trip?.title}</Typography>
          <Box sx={{ mt: 4 }}>
            <Button onClick={addNewList} className="btn-primary">
              Add list
            </Button>
          </Box>
          {addNewListDialog && trip && (
            <ClickAwayListener onClickAway={() => setAddNewTripDialog(false)}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 3,
                }}
                component="form"
                onSubmit={handleSubmitNewList}
              >
                <TextField
                  label="Name your list"
                  name="new-list"
                  type="text"
                  variant="standard"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  required
                  sx={{ flex: 1 }}
                />
                <Button
                  sx={{ marginLeft: 0, color: "black" }}
                  variant="text"
                  type="submit"
                >
                  OK
                </Button>
              </Box>
            </ClickAwayListener>
          )}
          {trip &&
            trip.lists?.map((list) => {
              return (
                <Box key={list._id}>
                  <Link
                    className="card-primary"
                    to={`/trip/${trip._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "left",
                        justifyContent: "space-between",
                        padding: "8px",
                      }}
                    >
                      <Typography
                        color="#2a3132"
                        sx={{ textAlign: "left", flex: 1 }}
                      >
                        {list.name}
                      </Typography>
                      <IconButton size="small" sx={{ color: "#2a3132" }}>
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Divider sx={{ marginTop: 1 }} />
                  </Link>
                </Box>
              );
            })}
        </Container>
      )}
    </>
  );
};

export default TripPage;
