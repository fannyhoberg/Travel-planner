import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { userCol } from "../services/firebase";
import { FirebaseError } from "firebase/app";

const useHandleUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (docId: string) => {
    setIsLoading(true);
    try {
      const userDocRef = doc(userCol, docId);

      await deleteDoc(userDocRef);
      console.log("Document deleted successfully:", userDocRef.path);
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Could not add new trip, something went wrong...");
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
