import { useState } from "react";
import { arrayUnion, doc, GeoPoint, updateDoc } from "firebase/firestore";
import { getGeopoint } from "../services/geocodingAPI";
import { db } from "../services/firebase";
import { v4 as uuidv4 } from "uuid";
import { Trip } from "../types/trip";

export const useHandleTrip = (
  tripId: string | undefined,
  trip: Trip | null
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add new list
  const addNewList = async (listName: string, selectedColor: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const tripDocRef = doc(db, "trips", tripId as string);

      const newList = {
        _id: uuidv4(),
        name: listName,
        color: selectedColor,
        items: [],
      };

      const updatedLists = arrayUnion(newList);

      await updateDoc(tripDocRef, {
        lists: updatedLists,
      });
    } catch (err) {
      setError("Error when trying to add new list");
    } finally {
      setIsLoading(false);
    }
  };

  // Update list
  const updateList = async (
    listId: string | null,
    newListName: string,
    color: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const tripDocRef = doc(db, "trips", tripId as string);
      console.log("newListName i hook", newListName);
      console.log("listId i hook", listId);

      const updatedLists = trip?.lists?.map((list) =>
        list._id === listId
          ? {
              ...list,
              name: newListName,
              color: color,
            }
          : list
      );

      console.log("Updated list", updatedLists);

      await updateDoc(tripDocRef, {
        lists: updatedLists,
      });
    } catch (err) {
      setError("Error when trying to update list");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteList = async (listId: string) => {
    if (!trip) return;

    setIsLoading(true);
    setError(null);
    try {
      const tripDocRef = doc(db, "trips", tripId as string);
      console.log("tripDocRef", tripDocRef);
      const updatedLists = trip.lists?.filter((list) => list._id !== listId);
      console.log("updatedLists", updatedLists);

      await updateDoc(tripDocRef, {
        lists: updatedLists,
      });
    } catch (err) {
      setError("Error when trying to delete list.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to list
  const addNewItem = async (
    listName: string | null,
    itemData: {
      title: string;
      address: string;
    }
  ) => {
    if (!tripId || !trip) return;
    setIsLoading(true);
    setError(null);

    let newItemObj: any = {
      _id: uuidv4(),
      title: itemData.title,
      address: itemData.address,
      completed: false,
    };

    try {
      if (itemData.address) {
        const payload = await getGeopoint(itemData.address);

        if (!payload) {
          throw new Error("Could not get geopoint");
        }

        newItemObj = {
          ...newItemObj,
          geopoint: new GeoPoint(payload.coords.lat, payload.coords.lng),
          place_id: payload.place_id,
        };
      }

      const tripDocRef = doc(db, "trips", tripId);

      const updatedLists = trip?.lists?.map((list) =>
        list.name === listName
          ? {
              ...list,
              items: [...(list.items || []), newItemObj],
            }
          : list
      );

      await updateDoc(tripDocRef, {
        lists: updatedLists,
      });
    } catch (err) {
      setError("Error when trying to add item");
    } finally {
      setIsLoading(false);
    }
  };

  // Update item
  const updateItem = async (
    listName: string | null,
    itemId: string,
    updatedData: {
      title: string;
      address?: string;
      geopoint?: GeoPoint;
      completed?: boolean;
    }
  ) => {
    if (!trip) return;
    setIsLoading(true);
    setError(null);

    try {
      const tripDocRef = doc(db, "trips", tripId as string);

      const updatedLists = trip?.lists?.map((list) =>
        list.name === listName
          ? {
              ...list,
              items: list.items?.map((item) => {
                if (item._id === itemId) {
                  const updatedItem = {
                    ...item,
                    ...updatedData,
                    address: updatedData.address || "",
                    geopoint: updatedData.geopoint || null,
                  };
                  return updatedItem;
                }
                return item;
              }),
            }
          : list
      );

      console.log("updatedLists", updatedLists);
      await updateDoc(tripDocRef, {
        lists: updatedLists,
      });
    } catch (err) {
      setError("Error when trying to update item");
    } finally {
      setIsLoading(false);
    }
  };

  // Mark item as completed
  const markItemAsCompleted = async (listName: string, itemId: string) => {
    if (!trip) return;
    setIsLoading(true);
    setError(null);

    try {
      const tripDocRef = doc(db, "trips", tripId as string);

      const updatedLists = trip?.lists?.map((list) =>
        list.name === listName
          ? {
              ...list,
              items: list.items?.map((item) =>
                item._id === itemId
                  ? { ...item, completed: !item.completed }
                  : item
              ),
            }
          : list
      );

      await updateDoc(tripDocRef, {
        lists: updatedLists,
      });
    } catch (err) {
      setError("Error when trying to toggle completed status");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete item
  const removeItemFromList = async (listName: string, itemId: string) => {
    if (!trip) return;
    setIsLoading(true);
    setError(null);

    try {
      const tripDocRef = doc(db, "trips", tripId as string);

      const updatedLists = trip?.lists?.map((list) =>
        list.name === listName
          ? {
              ...list,
              items: list.items?.filter((item) => item._id !== itemId),
            }
          : list
      );

      await updateDoc(tripDocRef, {
        lists: updatedLists,
      });
    } catch (err) {
      setError("Error when trying to remove item");
    } finally {
      setIsLoading(false);
    }
  };

  // update notes
  const updateTripNotes = async (notes: string) => {
    if (!tripId) return;
    try {
      const tripDocRef = doc(db, "trips", tripId);
      await updateDoc(tripDocRef, {
        notes,
      });
      console.log("Notes updated!");
    } catch (err) {
      setError("Error when trying to remove item");
      console.error("Error when trying to remove item");
    }
  };

  const inviteFriend = async (
    userId: string | undefined,
    email: string | undefined
  ) => {
    if (!tripId) return;

    try {
      const tripDocRef = doc(db, "trips", tripId);

      const allowedUser = {
        id: userId,
        email: email,
      };

      await updateDoc(tripDocRef, {
        allowedUsers: arrayUnion(allowedUser),
      });
    } catch (err) {
      setError("Error when trying to invite friend");
      console.error("Error when trying to invite friend");
    }
  };

  const removeFriend = async (userId: string) => {
    if (!tripId) return;

    try {
      const tripDocRef = doc(db, "trips", tripId);

      const updatedAllowedUsers = trip?.allowedUsers?.filter(
        (user) => user.id !== userId
      );

      await updateDoc(tripDocRef, {
        allowedUsers: updatedAllowedUsers,
      });

      console.log(`User with ID ${userId} removed successfully`);
    } catch (err) {
      setError("Error when trying to remove friend");
      console.error("Error when trying to remove friend", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    addNewList,
    updateList,
    deleteList,
    addNewItem,
    updateItem,
    markItemAsCompleted,
    removeItemFromList,
    updateTripNotes,
    inviteFriend,
    removeFriend,
  };
};
