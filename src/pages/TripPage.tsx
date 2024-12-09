import { useParams } from "react-router-dom";
import useGetTrip from "../hooks/useGetTrip";
import { Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { GeoPoint } from "firebase/firestore";
import { getGeopoint } from "../services/geocodingAPI";
import MobileTripPage from "../components/MobileTripPage";
import DesktopTripPage from "../components/DesktopTripPage";
import { v4 as uuidv4 } from "uuid";
import { useHandleTrip } from "../hooks/useHandleTrip";

const TripPage = () => {
  const [addNewListDialog, setAddNewTripDialog] = useState(false);
  const [updateItemDialog, setUpdateItemDialog] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState<string | null>(null);
  const [listName, setListName] = useState<string>("");
  const [addingList, setAddingList] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const { id } = useParams();

  const { data: trip, isError, isLoading } = useGetTrip(id);

  const {
    addNewList,
    addNewItem,
    updateItem,
    markItemAsCompleted,
    removeItemFromList,
  } = useHandleTrip(id, trip);

  const handleAddNewList = () => {
    setAddNewTripDialog(true);
  };

  const closeDialog = () => {
    setAddNewTripDialog(false);
    setAddingList(null);
    setUpdateItemDialog(false);
  };

  const hasItemsInLists = trip?.lists?.some(
    (list) => list.items && list.items.length > 0
  );

  const handleSubmitNewList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim()) return;

    await addNewList(listName, selectedColor);
    setListName("");
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

  const markPlaceAsDone = async (listName: string, itemId: string) => {
    await markItemAsCompleted(listName, itemId);
  };

  const removeItemFromListHandler = async (
    listName: string,
    itemId: string
  ) => {
    await removeItemFromList(listName, itemId);
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
            <MobileTripPage
              onAddNewList={handleAddNewList}
              addNewListDialog={addNewListDialog}
              data={trip}
              handleSubmitNewList={handleSubmitNewList}
              addingList={addingList}
              onHandleSubmitItem={handleSubmitItem}
              onCloseDialog={closeDialog}
              hasItemsInLists={hasItemsInLists}
              setAddNewTripDialog={setAddNewTripDialog}
              setListName={setListName}
              setAddingList={setAddingList}
              onMarkPlaceAsDone={markPlaceAsDone}
              onRemoveItemFromList={removeItemFromListHandler}
              updateItemDialog={updateItemDialog}
              setUpdateItemDialog={setUpdateItemDialog}
              setItemToUpdate={setItemToUpdate}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          )}
          {!isMobile && (
            <DesktopTripPage
              onAddNewList={handleAddNewList}
              addNewListDialog={addNewListDialog}
              data={trip}
              handleSubmitNewList={handleSubmitNewList}
              addingList={addingList}
              onHandleSubmitItem={handleSubmitItem}
              onCloseDialog={closeDialog}
              hasItemsInLists={hasItemsInLists}
              setAddNewTripDialog={setAddNewTripDialog}
              setListName={setListName}
              setAddingList={setAddingList}
              onMarkPlaceAsDone={markPlaceAsDone}
              onRemoveItemFromList={removeItemFromListHandler}
              updateItemDialog={updateItemDialog}
              setUpdateItemDialog={setUpdateItemDialog}
              setItemToUpdate={setItemToUpdate}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          )}
        </Container>
      )}
    </>
  );
};

export default TripPage;
