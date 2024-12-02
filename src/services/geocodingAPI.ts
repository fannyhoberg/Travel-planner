import axios from "axios";

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

interface ReverseGeocodingRes {
  results: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
  }[];
  status: string;
}

export const getGeopoint = async (address: string, city: string) => {
  const res = await axios.get<GeopointRes>(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address},${city}&key=${API_KEY}`
  );
  const coords = res.data.results[0].geometry.location;
  const place_id = res.data.results[0].place_id;
  return { coords, place_id };
};

export const getCityFromCoords = async (lat: number, lng: number) => {
  const res = await axios.get<ReverseGeocodingRes>(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
  );

  const address_components = res.data.results[0].address_components;

  const postal_townObj = address_components.find((component) =>
    component.types.includes("postal_town")
  );

  if (postal_townObj) {
    return postal_townObj.long_name;
  }
};
