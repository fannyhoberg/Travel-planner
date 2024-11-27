import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      return;
    }
  }, [currentUser]);

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
