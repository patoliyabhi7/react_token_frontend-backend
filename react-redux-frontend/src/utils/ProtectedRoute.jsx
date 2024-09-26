import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Make sure to import useAuth

const ProtectedRoute = ({ authenticationRequired = true }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (authenticationRequired) {
    return isAuthenticated ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;
  } else {
    return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
  }
};

export default ProtectedRoute;