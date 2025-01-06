import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

const useGetUserByEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserByEmail = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      return {
        id: userData._id,
        email: userDoc.data().email,
        ...userDoc.data(),
      };
    } catch (err) {
      setError("Failed to fetch user by email");
      console.error("Error fetching user by email:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { getUserByEmail, isLoading, error };
};

export default useGetUserByEmail;
