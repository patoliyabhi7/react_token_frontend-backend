// ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingLayout from './../components/LoadingLayout';

const ProtectedRoute = ({ authenticationRequired = true }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingLayout />;
  }

  if (authenticationRequired) {
    return isAuthenticated ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;
  } else {
    return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
  }
};

export default ProtectedRoute;