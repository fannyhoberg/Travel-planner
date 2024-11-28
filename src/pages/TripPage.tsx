import { useParams } from "react-router-dom";
import useGetTrip from "../hooks/useGetTrip";

const TripPage = () => {
  const { id } = useParams();

  const { data: trip, isError, isLoading } = useGetTrip(id);

  return (
    <>
      {!isLoading && !isError && <div>{trip?.title}</div>}
      {isLoading && <div>Loading...</div>}
      {isError && <div>Something went wrong</div>}
    </>
  );
};

export default TripPage;
