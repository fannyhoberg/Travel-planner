import { tripCol } from "../services/firebase";
import useGetDocument from "./useGetDocument";

const useGetTrip = (tripId: string | undefined) => {
  return useGetDocument(tripCol, tripId);
};

export default useGetTrip;
