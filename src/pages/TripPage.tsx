import { useParams } from "react-router-dom";
import useGetTrip from "../hooks/useGetTrip";
import { Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { arrayUnion, doc, GeoPoint, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { getGeopoint } from "../services/geocodingAPI";
import MobileTripPage from "../components/MobileTripPage";
import DesktopTripPage from "../components/DesktopTripPage";
import { v4 as uuidv4 } from "uuid";

const TripPage = () => {
  const [addNewListDialog, setAddNewTripDialog] = useState(false);
  const [listName, setListName] = useState<string>("");
  const [addingList, setAddingList] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const { id } = useParams();

  const { data: trip, isError, isLoading } = useGetTrip(id);

  const addNewList = () => {
    setAddNewTripDialog(true);
  };

  const closeDialog = () => {
    setAddNewTripDialog(false);
    setAddingList(null);
  };

  const hasItemsInLists = trip?.lists?.some(
    (list) => list.items && list.items.length > 0
  );

  const handleSubmitNewList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim()) return;

    try {
      const tripDocRef = doc(db, "trips", id as string);

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
      _id: uuidv4(),
      ...item,
      geopoint: new GeoPoint(payload.coords.lat, payload.coords.lng),
      completed: false,
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

  const markPlaceAsDone = async (listName: string, itemId: string) => {
    try {
      const tripDocRef = doc(db, "trips", id as string);
      const updatedLists = trip?.lists?.map((list) =>
        list.name === listName
          ? {
              ...list,
              items: list?.items?.map((item) => {
                console.log("Checking item:", item._id, "against", itemId);
                return item._id === itemId
                  ? { ...item, completed: !item.completed }
                  : item;
              }),
            }
          : list
      );

      await updateDoc(tripDocRef, { lists: updatedLists });
      setAddingList(null);
    } catch (error) {
      console.error("Error marking item as done:", error);
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
            <MobileTripPage
              onAddNewList={addNewList}
              addNewListDialog={addNewListDialog}
              data={trip}
              handleSubmitNewList={handleSubmitNewList}
              listName={listName}
              addingList={addingList}
              onHandleSubmitItem={handleSubmitItem}
              onCloseDialog={closeDialog}
              hasItemsInLists={hasItemsInLists}
              setAddNewTripDialog={setAddNewTripDialog}
              setListName={setListName}
              setAddingList={setAddingList}
              onMarkPlaceAsDone={markPlaceAsDone}
            />
          )}
          {!isMobile && (
            <DesktopTripPage
              onAddNewList={addNewList}
              addNewListDialog={addNewListDialog}
              data={trip}
              handleSubmitNewList={handleSubmitNewList}
              listName={listName}
              addingList={addingList}
              onHandleSubmitItem={handleSubmitItem}
              onCloseDialog={closeDialog}
              hasItemsInLists={hasItemsInLists}
              setAddNewTripDialog={setAddNewTripDialog}
              setListName={setListName}
              setAddingList={setAddingList}
              onMarkPlaceAsDone={markPlaceAsDone}
            />
          )}
        </Container>
      )}
    </>
  );
};

export default TripPage;
