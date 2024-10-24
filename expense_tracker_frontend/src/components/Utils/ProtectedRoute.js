import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './Auth'; 

const ProtectedRoute = ({ element }) => {
  const isAuth = isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return element; 
};

export default ProtectedRoute;
