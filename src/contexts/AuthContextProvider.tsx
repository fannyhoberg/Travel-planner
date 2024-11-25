import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import React, { createContext, PropsWithChildren } from "react";
import { auth } from "../services/firebase";

interface Authtypes {
  signup: (email: string, password: string) => Promise<UserCredential>;
}

export const AuthContext = createContext<Authtypes | null>(null);

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const authContextValue: Authtypes = {
    signup,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <>{children}</>
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
