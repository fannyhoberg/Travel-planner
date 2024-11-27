import { newTripCol } from "../services/firebase";
import { NewTrip } from "../types/trip";
import useAddDocument from "./useAddDocument";
import useAuth from "./useAuth";

const useAddTrip = () => {
  const { addDocument, error, loading } = useAddDocument();
  const { currentUser } = useAuth();

  const addTrip = (data: NewTrip) => {
    if (!currentUser) {
      throw new Error("You are not authorized to use this hook");
    }

    const newTripObj = {
      title: data.title,
      userId: data.userId,
    };

    // add trip to db

    console.log("addtrip hook: newTripCol", newTripCol);
    console.log("addtrip hook: newTripObj", newTripObj);

    addDocument(newTripCol, newTripObj);
  };
  return { addTrip, error, loading };
};

export default useAddTrip;
