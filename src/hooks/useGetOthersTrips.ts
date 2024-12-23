import { useMemo } from "react";
import { tripCol } from "../services/firebase";
import useGetCollection from "./useGetCollection";
import { where } from "firebase/firestore";

const useGetOthersTrips = (uid: string | undefined) => {
  const queryConstraints = useMemo(() => [where("userId", "!=", uid)], [uid]);
  return useGetCollection(tripCol, ...queryConstraints);
};

export default useGetOthersTrips;
