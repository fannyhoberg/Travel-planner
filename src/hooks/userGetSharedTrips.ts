import { useMemo } from "react";
import { tripCol } from "../services/firebase";
import useGetCollection from "./useGetCollection";

const useGetSharedTrips = (uid: string | undefined) => {
  const { data, isLoading } = useGetCollection(tripCol);

  const sharedTrips = useMemo(() => {
    if (!data || !uid) return [];
    return data.filter((trip) =>
      trip.allowedUsers?.some((user: { id: string }) => user.id === uid)
    );
  }, [data, uid]);

  return { data: sharedTrips, isLoading };
};

export default useGetSharedTrips;
