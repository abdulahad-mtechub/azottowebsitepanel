import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { isAuthenticated, hasValidSession } from "../utils/tokenManager";
import { refreshAccessToken } from "../utils/tokenRefreshService";

/**
 * PublicRoute Component
 * Prevents authenticated users from accessing auth pages (login, signup, forgot password)
 * If user is logged in, redirects them to home or their intended destination
 */
const PublicRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const hasAccess = isAuthenticated();
      const hasSession = hasValidSession();

      // Case 1: Has access token - user is authenticated
      if (hasAccess) {
        setUserIsAuthenticated(true);
        setIsChecking(false);
        return;
      }

      // Case 2: No access token but has refresh token - try to recover
      if (!hasAccess && hasSession) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          setUserIsAuthenticated(true);
        } else {
          setUserIsAuthenticated(false);
        }
        setIsChecking(false);
        return;
      }

      // Case 3: No tokens at all - not authenticated, allow access
      setUserIsAuthenticated(false);
      setIsChecking(false);
    };

    checkAuth();
  }, [location.pathname]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#fff",
        }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    );
  }

  // If user is authenticated, redirect to home (or intended destination)
  if (userIsAuthenticated) {
    // Check if there's a redirect location from previous navigation
    const from = location.state?.from?.pathname || "/";

    return <Navigate to={from} replace />;
  }

  // User is not authenticated, show the auth page (login/signup/forgot password)
  return children;
};

export default PublicRoute;
