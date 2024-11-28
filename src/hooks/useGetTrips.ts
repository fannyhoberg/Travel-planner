import { tripCol } from "../services/firebase";
import useGetCollection from "./useGetCollection";

const useGetTrips = () => {
  return useGetCollection(tripCol);
};

export default useGetTrips;
