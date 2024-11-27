import { FirebaseError } from "firebase/app";
import { CollectionReference, doc, setDoc } from "firebase/firestore";
import { useState } from "react";

const useAddDocument = () => {
  const [error, setError] = useState<string | false>(false);
  const [loading, setLoading] = useState(false);

  const addDocument = async <NewDocumentType>(
    colRef: CollectionReference<NewDocumentType>,
    data: NewDocumentType
  ) => {
    const docRef = doc(colRef);
    try {
      setLoading(true);
      console.log("addDocumnt hook: docRef", docRef);
      console.log("addDocumnt hook: data", data);
      await setDoc(docRef, data);

      console.log("addDocumnt hook: efter setDoc");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
        console.error("FirebaseError:", err.message);
      } else {
        setError(
          "Something went wrong when trying to add new document to database"
        );
        console.error("Unknown error:", err);
      }
    } finally {
      setLoading(false);
    }
  };
  return { addDocument, error, loading };
};

export default useAddDocument;
