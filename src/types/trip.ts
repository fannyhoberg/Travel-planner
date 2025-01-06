import { GeoPoint } from "firebase/firestore";

export type Trip = {
  _id: string;
  userId: string;
  title: string;
  notes?: string;
  lists?: List[];
  allowedUsers?: AllowedUserData[];
};

export type AllowedUserData = {
  id: string;
  email: string;
};

export type TripTextData = {
  title: string;
};

export type List = {
  _id: string;
  name: string;
  color: string;
  items?: Item[];
};

export type ListTextData = Omit<List, "_id">;

export type Item = {
  _id: string;
  title: string;
  address: string;
  completed: boolean;
  postcode?: number;
  place_id: string;
  city: string;
  geopoint: GeoPoint;
};

export type NewTrip = Omit<Trip, "_id">;

export type PositionCoords = {
  lat: number;
  lng: number;
};

export type ItemTextData = Omit<Item, "_id" | "geopoint">;
