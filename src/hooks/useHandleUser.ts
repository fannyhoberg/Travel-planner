import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { db, userCol } from "../services/firebase";
import { FirebaseError } from "firebase/app";

const useHandleUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const deleteUser = async (docId: string) => {
    try {
      setIsLoading(true);
      setError(false);
      const userDocRef = doc(userCol, docId);

      await deleteDoc(userDocRef);
      console.log("Document deleted successfully:", userDocRef.path);
    } catch (err) {
      setError(true);
      if (err instanceof FirebaseError) {
        console.error(err.message);
      } else if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Could not add new trip, something went wrong..");
      }
    }
    setIsLoading(false);
  };

  return {
    deleteUser,
    error,
    isLoading,
  };
};

export default useHandleUser;
