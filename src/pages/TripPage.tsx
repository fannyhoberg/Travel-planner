import { useParams } from "react-router-dom";
import useGetTrip from "../hooks/useGetTrip";
import {
  Container,
  TextField,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";

import { useState } from "react";
import { GeoPoint } from "firebase/firestore";
import { getGeopoint } from "../services/geocodingAPI";
import { v4 as uuidv4 } from "uuid";
import { useHandleTrip } from "../hooks/useHandleTrip";
import TripList from "../components/TripList";
import ItemFormDialog from "../components/ItemFormDialog";
import ListFormDialog from "../components/ListFormDialog";
import Map from "../components/Map";
import { Item, ListTextData } from "../types/trip";
import BackButton from "../components/BackButton";
import useAuth from "../hooks/useAuth";
import AccessDenied from "../components/AccessDenied";

const TripPage = () => {
  const [addNewListDialog, setAddNewTripDialog] = useState(false);
  const [updateItemDialog, setUpdateItemDialog] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState<string | null>(null);

  const [listName, setListName] = useState<string>("");
  const [addingList, setAddingList] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [initialValues, setInitialValues] = useState<Partial<Item>>({
    title: "",
    address: "",
    city: "",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<null | string>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const { id } = useParams();

  const { currentUser } = useAuth();
  const { data: trip, isError, isLoading } = useGetTrip(id);
  console.log("trip user id", trip?.userId);

  const { addNewList, addNewItem, updateItem } = useHandleTrip(id, trip);

  const handleOpenPopup = (
    event: React.MouseEvent<HTMLElement>,
    itemId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(itemId);
  };

  const handleClosePopup = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const isPopupOpen = Boolean(anchorEl);

  const closeDialog = () => {
    setAddNewTripDialog(false);
    setAddingList(null);
    setUpdateItemDialog(false);
  };

  const hasItemsInLists = trip?.lists?.some(
    (list) => list.items && list.items.length > 0
  );

  const handleAddNewList = () => {
    setAddNewTripDialog(true);
  };

  const handleSubmitNewList = async (data: ListTextData) => {
    await addNewList(data.name, data.color);
    setListName("");
    setAddingList(null);
    setAddNewTripDialog(false);
  };

  const handleSubmitItem = async (item: {
    title: string;
    address: string;
    city: string;
  }) => {
    if (!trip) return;

    const payload = await getGeopoint(item.address, item.city);

    if (!payload) {
      console.error("Geopoint retrieval failed");
      return;
    }

    const newItemObj = {
      geopoint: new GeoPoint(payload.coords.lat, payload.coords.lng),
      place_id: payload.place_id,
      title: item.title,
      address: item.address,
      city: item.city,
    };

    if (updateItemDialog) {
      const updatedItemObj = {
        ...newItemObj,
      };

      try {
        await updateItem(listName, itemToUpdate!, updatedItemObj);
      } catch (error) {
        console.error("Error updating item:", error);
      }
      setUpdateItemDialog(false);
      setItemToUpdate(null);
      setAddingList(null);
    } else {
      const newItemWithId = {
        _id: uuidv4(),
        ...newItemObj,
        completed: false,
      };

      await addNewItem(addingList, newItemWithId);
      setAddingList(null);
    }
  };

  if (currentUser?.uid !== trip?.userId) {
    return <AccessDenied />;
  }

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Something went wrong</div>}
      {!isLoading && !isError && (
        <Container sx={{ mb: "10vh" }} maxWidth={isMobile ? "sm" : "lg"}>
          <BackButton />

          <Typography sx={{ pt: 4 }} variant="h3">
            {trip?.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
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
              {hasItemsInLists && !isMobile && <Map />}
              {!isMobile && (
                <>
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
                </>
              )}
            </Box>
            <Box
              sx={{
                flex: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: isMobile ? "center" : "flex-end",
                }}
              >
                <Button
                  onClick={handleAddNewList}
                  className="btn-primary"
                  aria-label="Add list"
                  title="Add list"
                >
                  Add list
                </Button>
              </Box>

              {addNewListDialog && trip && (
                <ListFormDialog
                  onClose={closeDialog}
                  handleSubmitNewList={handleSubmitNewList}
                  setListName={setListName}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                />
              )}
              <Box sx={{ width: "100%" }}>
                <TripList
                  setAddingList={setAddingList}
                  handleOpenPopup={handleOpenPopup}
                  isPopupOpen={isPopupOpen}
                  selectedItem={selectedItem}
                  anchorEl={anchorEl}
                  handleClosePopup={handleClosePopup}
                  setInitialValues={setInitialValues}
                  setListName={setListName}
                  setUpdateItemDialog={setUpdateItemDialog}
                  setItemToUpdate={setItemToUpdate}
                  trip={trip}
                  id={id}
                />
              </Box>
              {addingList && (
                <ItemFormDialog
                  onSubmit={handleSubmitItem}
                  onClose={closeDialog}
                  listName={addingList}
                />
              )}

              {updateItemDialog && (
                <ItemFormDialog
                  onSubmit={handleSubmitItem}
                  onClose={closeDialog}
                  listName={addingList}
                  initialValues={initialValues}
                />
              )}
            </Box>
          </Box>

          {isMobile && (
            <>
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
            </>
          )}
          {hasItemsInLists && isMobile && <Map />}
        </Container>
      )}
    </>
  );
};

export default TripPage;
