import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  User,
} from "firebase/auth";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { auth } from "../services/firebase";

interface Authtypes {
  signup: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  currentUser: User | null;
}

export const AuthContext = createContext<Authtypes | null>(null);

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const authContextValue: Authtypes = {
    signup,
    login,
    logout,
    currentUser,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={authContextValue}>
      <>{children}</>
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
