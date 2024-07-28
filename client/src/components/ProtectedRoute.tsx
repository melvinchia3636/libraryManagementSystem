import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  return !loading ? (
    isAuthenticated ? (
      <Outlet />
    ) : (
      <Navigate to="/login" />
    )
  ) : (
    <></>
  );
};

export default ProtectedRoute;
