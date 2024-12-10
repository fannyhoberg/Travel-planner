import { where } from "firebase/firestore";
import { useMemo } from "react";
import useGetCollection from "./useGetCollection";
import { userCol } from "../services/firebase";

const useGetUser = (uid: string | undefined) => {
  const queryConstraints = useMemo(() => {
    return uid ? [where("_id", "==", uid)] : [];
  }, [uid]);
  return useGetCollection(userCol, ...queryConstraints);
};

export default useGetUser;
