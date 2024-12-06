import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Item, PositionCoords } from "../types/trip";
import { useCallback, useMemo, useState } from "react";
import useGetTrip from "../hooks/useGetTrip";
import { useParams } from "react-router-dom";
import { GeoPoint } from "firebase/firestore";
import { Box, Typography } from "@mui/material";

const Map = () => {
  const { id } = useParams();
  const { data: trip, isError, isLoading } = useGetTrip(id);
  const [selectedItem, setSelectedItem] = useState<null | {
    title: string;
    adress: string;
    city: string;
    position: PositionCoords;
  }>(null);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    console.log("Map loaded", mapInstance);
  }, []);

  const getMarkerIcon = (color: string) => {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <circle cx="12" cy="12" r="11" fill="${color}" />
      </svg>
    `)}`;
  };

  const handleMarkerClick = (item: Item, position: GeoPoint) => {
    setSelectedItem({
      title: item.title,
      adress: item.address,
      city: item.city,
      position: {
        lat: position.latitude,
        lng: position.longitude,
      },
    });
  };

  const defaultCenter: PositionCoords = { lat: 37.7749, lng: -122.4194 };

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

            if (geopoint) {
              return (
                <Marker
                  key={item._id}
                  onClick={() => handleMarkerClick(item, geopoint)}
                  position={{
                    lat: geopoint.latitude,
                    lng: geopoint.longitude,
                  }}
                  title={item.title}
                  icon={getMarkerIcon(list.color)}
                />
              );
            }
            return null;
          });
        })}

        {selectedItem && (
          <InfoWindow
            position={selectedItem.position}
            onCloseClick={() => setSelectedItem(null)}
          >
            <Box>
              <Typography variant="h5">{selectedItem.title}</Typography>
              <Typography>{selectedItem.adress}</Typography>
              <Typography>{selectedItem.city}</Typography>
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
