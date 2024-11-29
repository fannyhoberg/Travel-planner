import { GoogleMap, Marker } from "@react-google-maps/api";
import { PositionCoords } from "../types/trip";
import { useCallback, useState } from "react";

const Map = () => {
  //   const [map, setMap] = useState<google.maps.Map | null>(null);

  const defaultCenter: PositionCoords = { lat: 37.7749, lng: -122.4194 };

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    console.log("Map loaded", mapInstance);
    // setMap(mapInstance);
  }, []);

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
        center={defaultCenter}
        onLoad={onLoad}
      ></GoogleMap>
    </div>
  );
};

export default Map;
