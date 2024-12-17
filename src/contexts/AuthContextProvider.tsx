import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  User,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
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
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  userName: string | null;
  userEmail: string | null;
  setDisplayName: (name: string) => Promise<void>;
  setEmail: (email: string) => Promise<void>;
  setPassword: (password: string) => Promise<void>;
  reloadUser: () => boolean;
  currentUser: User | null;
  deleteAccount: () => Promise<void>;
  reauthenticateUser: (password: string) => Promise<void>;
}

export const AuthContext = createContext<Authtypes | null>(null);

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email, {
      url: window.location.origin + "/login",
    });
  };

  const logout = () => {
    return signOut(auth);
  };

  const setDisplayName = (name: string) => {
    if (!currentUser) {
      throw new Error("You can't update username, you need to log in first!");
    }
    return updateProfile(currentUser, { displayName: name });
  };

  const setEmail = (email: string) => {
    if (!currentUser) {
      throw new Error("You can't update email, you need to log in first!");
    }
    return updateEmail(currentUser, email);
  };

  const setPassword = (password: string) => {
    if (!currentUser) {
      throw new Error("You can't update password, you need to log in first!");
    }
    return updatePassword(currentUser, password);
  };

  const deleteAccount = () => {
    if (!currentUser) {
      throw new Error("You can't delete account, you need to log in first!");
    }
    return deleteUser(currentUser);
  };

  const reauthenticateUser = async (password: string) => {
    if (!currentUser || !currentUser.email) {
      throw new Error("User must be logged in to reauthenticate.");
    }

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      password
    );

    await reauthenticateWithCredential(currentUser, credential);
  };

  const reloadUser = () => {
    if (!currentUser) {
      return false;
    }
    setUserName(currentUser.displayName);
    setUserEmail(currentUser.email);

    return true;
  };

  const authContextValue: Authtypes = {
    signup,
    login,
    resetPassword,
    logout,
    userEmail,
    userName,
    setDisplayName,
    setEmail,
    setPassword,
    reloadUser,
    currentUser,
    deleteAccount,
    reauthenticateUser,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        setUserName(user.displayName);
        setUserEmail(user.email);
      } else {
        setUserName(null);
        setUserEmail(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={authContextValue}>
      {loading ? (
        <div>
          <span className="visibility-hidden">Loading...</span>
        </div>
      ) : (
        <>{children}</>
      )}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
