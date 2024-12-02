import { GoogleMap, Marker } from "@react-google-maps/api";
import { PositionCoords, Item } from "../types/trip";
import { useCallback, useMemo } from "react";
import useGetTrip from "../hooks/useGetTrip";
import { useParams } from "react-router-dom";

const Map = () => {
  const defaultCenter: PositionCoords = { lat: 37.7749, lng: -122.4194 };

  const { id } = useParams();
  const { data: trip, isError, isLoading } = useGetTrip(id);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    console.log("Map loaded", mapInstance);
  }, []);

  const center = useMemo(() => {
    if (!trip) return defaultCenter;

    let totalLat = 0;
    let totalLng = 0;
    let markerCount = 0;

    trip?.lists?.forEach((list) => {
      list?.items?.forEach((item) => {
        if (item.geopoint) {
          totalLat += item.geopoint.latitude;
          totalLng += item.geopoint.longitude;
          markerCount++;
        }
      });
    });

    if (markerCount > 0) {
      return {
        lat: totalLat / markerCount,
        lng: totalLng / markerCount,
      };
    }

    return defaultCenter;
  }, [trip]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !trip) {
    return <div>Error loading trip data.</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "1rem",
        marginTop: 4,
        overflow: "hidden",
      }}
    >
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "500px",
        }}
        zoom={9}
        center={center}
        onLoad={onLoad}
      >
        {trip?.lists?.map((list) => {
          return list?.items?.map((item) => {
            const { geopoint } = item;

            // Om geopoint finns, skapa en marker
            if (geopoint) {
              return (
                <Marker
                  key={item._id}
                  position={{
                    lat: geopoint.latitude,
                    lng: geopoint.longitude,
                  }}
                  title={item.title}
                />
              );
            }
            return null;
          });
        })}
      </GoogleMap>
    </div>
  );
};

export default Map;
