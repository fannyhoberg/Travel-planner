import { useMemo } from "react";
import { tripCol } from "../services/firebase";
import useGetCollection from "./useGetCollection";
import { where } from "firebase/firestore";

const useGetMyTrips = (uid: string | undefined) => {
  const queryConstraints = useMemo(() => [where("userId", "==", uid)], [uid]);
  return useGetCollection(tripCol, ...queryConstraints);
};

export default useGetMyTrips;
