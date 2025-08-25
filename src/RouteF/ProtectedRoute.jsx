import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const authToken = Cookies.get('authToken'); // must match where you set token
  const location = useLocation();
  // If no token, redirect to home (you asked to go to "/")
  if (!authToken) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // token exists -> allow
  return children;
};

export default ProtectedRoute;
