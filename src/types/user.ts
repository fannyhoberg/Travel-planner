export type User = {
  _id: string;
  name?: string;
  photoUrls?: string;
  email: string;
};

export type NewUser = Omit<User, "_id">;
