import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Item, PositionCoords } from "../types/trip";
import { useCallback, useMemo, useState } from "react";
import useGetTrip from "../hooks/useGetTrip";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { getDirectionsURL } from "../services/geocodingAPI";

const Map = () => {
  const { id } = useParams();
  const { data: trip, isError, isLoading } = useGetTrip(id);
  const [selectedItem, setSelectedItem] = useState<null | {
    title: string;
    adress: string;
    city: string;
    position: PositionCoords;
  }>(null);
  const [itemGeopoint, setItemGeopoint] = useState<PositionCoords | null>(null);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    console.log("Map loaded", mapInstance);
  }, []);

  const getMarkerIcon = (color: string) => {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" stroke="#004F32" stroke-width="1">
        <circle cx="12" cy="12" r="11" fill="${color}" />
      </svg>
    `)}`;
  };

  const handleMarkerClick = (item: Item, position: PositionCoords) => {
    const markerPosition = { lat: position.lat, lng: position.lng };

    setSelectedItem({
      title: item.title,
      adress: item.address,
      city: item.city,
      position: markerPosition,
    });
  };

  const defaultCenter: PositionCoords = { lat: 37.7749, lng: -122.4194 };

  const directionsUrl = itemGeopoint
    ? getDirectionsURL({
        lat: itemGeopoint.lat,
        lng: itemGeopoint.lng,
      })
    : "#";

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
              const position: PositionCoords = {
                lat: geopoint.latitude,
                lng: geopoint.longitude,
              };
              return (
                <Marker
                  key={item._id}
                  onClick={() => {
                    handleMarkerClick(item, position),
                      setItemGeopoint({
                        lat: position.lat,
                        lng: position.lng,
                      });
                  }}
                  position={position}
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
            options={{
              pixelOffset: new google.maps.Size(-5, -40),
            }}
          >
            <Box>
              <Typography variant="h5">{selectedItem.title}</Typography>
              <Typography>{selectedItem.adress}</Typography>
              <Typography>{selectedItem.city}</Typography>
              <a href={directionsUrl} target="_blank">
                Get directions
              </a>
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
