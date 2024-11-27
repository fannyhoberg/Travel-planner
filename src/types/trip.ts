import { GeoPoint } from "firebase/firestore";

export type Trip = {
  _id: string;
  userId: string;
  title: string;
  lists?: List[];
};

export type List = {
  _id: string;
  name: string;
  items?: Item[];
};

export type Item = {
  _id: string;
  name: string;
  address: string;
  postcode: number;
  city: string;
  geopoint: GeoPoint;
};

export type NewTrip = Omit<Trip, "_id">;
