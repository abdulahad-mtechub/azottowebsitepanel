import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, hasValidSession } from "../utils/tokenManager";
import { refreshAccessToken } from "../utils/tokenRefreshService";

const PublicRoute = ({ children }) => {
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const hasAccess = isAuthenticated();
      const hasSession = hasValidSession();
      // Case 1: Has access token - user is authenticated
      if (hasAccess) {
        setUserIsAuthenticated(true);
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
        return;
      }
      // Case 3: No tokens at all - not authenticated, allow access
      setUserIsAuthenticated(false);
    };

    checkAuth();
  }, [location.pathname]);

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
