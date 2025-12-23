// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import {
  isAuthenticated,
  getUserData,
  clearAuthTokens,
  setAuthTokens,
} from "../utils/tokenManager";
import { stopAutoRefresh } from "../utils/tokenRefreshService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState(getUserData());

  // Check authentication status on mount
  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    if (authenticated) {
      setUser(getUserData());
    }
  }, []);

  const login = (accessToken, refreshToken, userData) => {
    setAuthTokens(accessToken, refreshToken, userData);
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    clearAuthTokens();
    stopAutoRefresh();
    setIsLoggedIn(false);
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser({ ...user, ...userData });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
