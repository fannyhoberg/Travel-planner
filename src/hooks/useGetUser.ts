import { where } from "firebase/firestore";
import { userCol } from "../services/firebase";
import { useMemo } from "react";
import useGetCollection from "./useGetCollection";

const useGetUser = (uid: string | undefined) => {
  const queryConstraints = useMemo(() => {
    return uid ? [where("_id", "==", uid)] : [];
  }, [uid]);

  return useGetCollection(userCol, ...queryConstraints);
};
export default useGetUser;
