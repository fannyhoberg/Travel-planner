import { GeoPoint } from "firebase/firestore";

export type Trip = {
  _id: string;
  userId: string;
  title: string;
  notes?: string;
  lists?: List[];
};

export type List = {
  _id: string;
  name: string;
  items?: Item[];
};

export type Item = {
  _id: string;
  title: string;
  address: string;
  completed: boolean;
  postcode?: number;
  city: string;
  geopoint?: GeoPoint;
};

export type NewTrip = Omit<Trip, "_id">;

export type PositionCoords = {
  lat: number;
  lng: number;
};

export type ItemTextData = Omit<Item, "_id" | "geopoint">;
