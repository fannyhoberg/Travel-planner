import {
  CollectionReference,
  onSnapshot,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const useGetCollection = <T>(
  colRef: CollectionReference<T>,
  ...queryConstraints: QueryConstraint[]
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T[] | null>(null);

  useEffect(() => {
    const queryRef = query(colRef, ...queryConstraints);

    const unsubsribe = onSnapshot(queryRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          _id: doc.id,
        };
      });
      setData(data);
      setIsLoading(false);
    });

    return unsubsribe;
  }, [colRef, ...queryConstraints]);

  return {
    data,
    isLoading,
  };
};

export default useGetCollection;
