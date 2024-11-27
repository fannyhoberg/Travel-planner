export type User = {
  _id: string;
  name?: string;
  email: string;
};

export type NewUser = Omit<User, "_id">;
