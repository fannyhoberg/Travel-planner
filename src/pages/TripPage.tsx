import { useParams } from "react-router-dom";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useState } from "react";
import { arrayUnion, doc, GeoPoint, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import AddItemToList from "../components/AddItemToList";
import Map from "../components/Map";
import { getGeopoint } from "../services/geocodingAPI";

const TripPage = () => {
  const [addNewListDialog, setAddNewTripDialog] = useState(false);
  const [listName, setListName] = useState<string>("");
  const [addingList, setAddingList] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const { id } = useParams();

  const { data: trip, isError, isLoading } = useGetTrip(id);
  console.log("data trip", trip);

  const addNewList = () => {
    setAddNewTripDialog(true);
  };

  const closeDialog = () => {
    setAddingList(null);
  };

  const hasItemsInLists = trip?.lists?.some(
    (list) => list.items && list.items.length > 0
  );

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

  const handleSubmitItem = async (item: {
    title: string;
    address: string;
    city: string;
  }) => {
    if (!trip) {
      console.log("No trip data");
      return;
    }

    const payload = await getGeopoint(item.address, item.city);

    if (!payload) {
      throw new Error("No payload");
    }

    const newItemObj = {
      ...item,
      geopoint: new GeoPoint(payload.coords.lat, payload.coords.lng),
      place_id: payload.place_id,
    };

    try {
      const tripDocRef = doc(db, "trips", id as string);
      const updatedLists = trip?.lists?.map((list) =>
        list.name === addingList
          ? {
              ...list,
              items: [...(list.items || []), newItemObj],
            }
          : list
      );

      await updateDoc(tripDocRef, { lists: updatedLists });
      setAddingList(null);
    } catch (error) {
      console.error("Error adding item to list:", error);
    }
  };
  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Something went wrong</div>}
      {!isLoading && !isError && (
        <Container sx={{ mb: "10vh" }} maxWidth={isMobile ? "sm" : "lg"}>
          <Typography sx={{ pt: 4 }} variant="h3">
            {trip?.title}
          </Typography>

          {isMobile && (
            <>
              <Box sx={{ mt: 4 }}>
                <Button onClick={addNewList} className="btn-primary">
                  Add list
                </Button>
              </Box>

              {addNewListDialog && trip && (
                <ClickAwayListener
                  onClickAway={() => setAddNewTripDialog(false)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 3,
                      mb: 5,
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
                        <IconButton
                          onClick={() => setAddingList(list.name)}
                          size="small"
                          sx={{ color: "#2a3132" }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      <Divider sx={{ marginTop: 1 }} />
                      {list.items && list.items.length > 0 ? (
                        <Box sx={{ padding: 3 }}>
                          {list.items.map((item) => (
                            <Box
                              key={item._id}
                              sx={{
                                marginBottom: 1,
                                padding: 2,
                                backgroundColor: "#FFB2AA",
                                borderRadius: 3,
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "100%",
                                  textAlign: "left",
                                }}
                              >
                                <Typography variant="body1" color="textPrimary">
                                  <strong>{item.title}</strong>
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {item.address}, {item.postcode}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      ) : null}
                    </Box>
                  );
                })}
              {addingList && (
                <AddItemToList
                  onSubmit={handleSubmitItem}
                  onClose={closeDialog}
                  listName={addingList}
                />
              )}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 3,
                }}
              >
                <Typography>Notes</Typography>
              </Box>
              <TextField
                fullWidth
                id="outlined-multiline-static"
                label=""
                multiline
                rows={4}
              />

              {hasItemsInLists && <Map />}
            </>
          )}
          {!isMobile && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 4,
                  mt: 4,
                }}
              >
                <Box
                  sx={{
                    flex: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {hasItemsInLists && <Map />}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 3,
                    }}
                  >
                    <Typography>Notes</Typography>
                  </Box>
                  <TextField
                    fullWidth
                    id="outlined-multiline-static"
                    label=""
                    multiline
                    rows={4}
                  />
                </Box>
                <Box
                  sx={{
                    flex: 2,
                    display: "flex",
                    flexDirection: "column",
                    // flexWrap: "wrap",
                    gap: 2,
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button onClick={addNewList} className="btn-primary">
                      Add list
                    </Button>
                  </Box>

                  {addNewListDialog && trip && (
                    <ClickAwayListener
                      onClickAway={() => setAddNewTripDialog(false)}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          //   alignItems: "center",
                          //   mt: 3,
                          mb: 5,
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
                        <Box
                          sx={{
                            width: "100%",
                          }}
                          key={list._id}
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
                            <IconButton
                              onClick={() => setAddingList(list.name)}
                              size="small"
                              sx={{ color: "#2a3132" }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                          <Divider sx={{ marginTop: 1 }} />
                          {list.items && list.items.length > 0 ? (
                            <Box sx={{ padding: 3 }}>
                              {list.items.map((item) => (
                                <Box
                                  key={item._id}
                                  sx={{
                                    marginBottom: 1,
                                    padding: 2,
                                    backgroundColor: "#FFB2AA",
                                    borderRadius: 3,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: "100%",
                                      textAlign: "left",
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      color="textPrimary"
                                    >
                                      <strong>{item.title}</strong>
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      {item.address}, {item.postcode}
                                    </Typography>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          ) : null}
                        </Box>
                      );
                    })}
                  {addingList && (
                    <AddItemToList
                      onSubmit={handleSubmitItem}
                      onClose={closeDialog}
                      listName={addingList}
                    />
                  )}
                </Box>
              </Box>
            </>
          )}
        </Container>
      )}
    </>
  );
};

export default TripPage;
