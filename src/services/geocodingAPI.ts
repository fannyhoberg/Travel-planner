import axios from "axios";
import { PositionCoords } from "../types/trip";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface GeopointRes {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    place_id: string;
  }[];
  status: string;
}

export const getGeopoint = async (address: string) => {
  if (!address) return null;

  const res = await axios.get<GeopointRes>(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`
  );
  const coords = res.data.results[0].geometry.location;
  const place_id = res.data.results[0].place_id;
  return { coords, place_id };
};

export const getDirectionsURL = (
  destinationCoords: PositionCoords | undefined,
  destination_place_id?: string
) => {
  console.log("destinationCoords", destinationCoords);
  console.log("destination_place_id", destinationCoords);

  if (!destinationCoords) return "#";
  const { lat, lng } = destinationCoords;
  if (destination_place_id) {
    return `https://www.google.com/maps/dir/?api=1&destination_place_id=${destination_place_id}&destination=there`;
  } else {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
};
