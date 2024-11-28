import { CollectionReference, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const useGetDocument = <T>(
  colRef: CollectionReference<T>,
  documentId: string | undefined
) => {
  const [data, setData] = useState<T | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(colRef, documentId);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) {
        setData(null);
        setIsError(true);
        setIsLoading(false);
        return;
      }

      const data = {
        ...snapshot.data(),
        _id: snapshot.id,
      };

      setData(data);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [colRef]);

  return {
    data,
    isError,
    isLoading,
  };
};

export default useGetDocument;
