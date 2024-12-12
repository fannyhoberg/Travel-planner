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
  const updateList = async (listId: string | null, newListName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const tripDocRef = doc(db, "trips", tripId as string);
      console.log("newListName i hook", newListName);
      console.log("listId i hook", listId);

      // Uppdatera listnamnet för den lista som matchar listId
      const updatedLists = trip?.lists?.map((list) =>
        list._id === listId // Se till att vi hittar rätt lista med hjälp av listId
          ? {
              ...list,
              name: newListName, // Uppdatera listans namn
            }
          : list
      );

      console.log("Updated list", updatedLists);

      // Skicka tillbaka uppdaterade listor till Firestore
      await updateDoc(tripDocRef, {
        lists: updatedLists,
      });
    } catch (err) {
      setError("Error when trying to update list");
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
      city: string;
    }
  ) => {
    if (!tripId || !trip) return;
    setIsLoading(true);
    setError(null);

    try {
      const payload = await getGeopoint(itemData.address, itemData.city);

      if (!payload) {
        throw new Error("Could not get geopoint");
      }

      const newItemObj = {
        _id: uuidv4(),
        ...itemData,
        geopoint: new GeoPoint(payload.coords.lat, payload.coords.lng),
        completed: false,
        place_id: payload.place_id,
      };

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
      address: string;
      city: string;
      geopoint: GeoPoint;
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
              items: list.items?.map((item) =>
                item._id === itemId ? { ...item, ...updatedData } : item
              ),
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

  return {
    isLoading,
    error,
    addNewList,
    updateList,
    addNewItem,
    updateItem,
    markItemAsCompleted,
    removeItemFromList,
  };
};
