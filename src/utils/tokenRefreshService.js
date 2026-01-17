import { client } from "../config/apolloClient";
import { REFRESH_TOKEN } from "../graphql/mutation/login";
import {
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
  shouldRefreshToken,
  isAuthenticated,
} from "./tokenManager";

let isRefreshing = false;
let refreshSubscribers = [];
let wsReconnectCallback = null;

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
  // Reconnect WebSocket to use new token
  if (wsReconnectCallback) {
    wsReconnectCallback();
  }
};

export const registerWSReconnect = (callback) => {
  wsReconnectCallback = callback;
};

export const refreshAccessToken = async () => {
  // If already refreshing, wait for that to complete
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token);
      });
    });
  }

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    console.error("❌ No refresh token available");
    clearAuthTokens();
    return null;
  }

  isRefreshing = true;

  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables: { token: refreshToken },
    });

    if (data?.refreshToken?.token) {
      const {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        user,
      } = data.refreshToken;

      // Store new tokens
      setAuthTokens(newAccessToken, newRefreshToken, user);

      // Notify all waiting requests
      onTokenRefreshed(newAccessToken);

      isRefreshing = false;
      return newAccessToken;
    } else {
      throw new Error("Invalid refresh token response");
    }
  } catch (error) {
    console.error("❌ Token refresh failed:", error.message);

    // Clear auth data and redirect to login
    clearAuthTokens();
    isRefreshing = false;

    // Only redirect if we're not already on login page
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    return null;
  }
};

export const ensureValidToken = async () => {
  if (!isAuthenticated()) {
    return false;
  }

  if (shouldRefreshToken()) {
    const newToken = await refreshAccessToken();
    return !!newToken;
  }

  return true; // Token is still valid
};

export const initializeAuth = async () => {
  const hasAccess = isAuthenticated();
  const hasRefresh = !!getRefreshToken();
  // Case 1: No tokens at all - user not logged in
  if (!hasAccess && !hasRefresh) {
    return false;
  }

  // Case 2: Has access token - check if needs refresh
  if (hasAccess) {
    if (shouldRefreshToken()) {
      const newToken = await refreshAccessToken();
      return !!newToken;
    }
    return true;
  }

  // Case 3: Access token missing but refresh token exists
  // This happens when user comes back after access token expired (>10 min)
  if (!hasAccess && hasRefresh) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

let autoRefreshInterval = null;

export const startAutoRefresh = async () => {
  // Clear any existing interval
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }

  // First, initialize/recover authentication
  const isAuth = await initializeAuth();

  if (!isAuth) {
    return false;
  }

  // Check token every 2 minutes (3-4 checks before 7-minute threshold)
  // Good balance between responsiveness and performance
  autoRefreshInterval = setInterval(
    async () => {
      if (isAuthenticated()) {
        if (shouldRefreshToken()) {
          await ensureValidToken();
        }
      } else {
        // Stop auto-refresh if user is not authenticated
        stopAutoRefresh();
      }
    },
    2 * 60 * 1000
  ); // 2 minutes - optimal balance

  return true;
};

export const stopAutoRefresh = () => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
  }
};

export const handleLogout = () => {
  stopAutoRefresh();
  clearAuthTokens();
  window.location.href = "/login";
};
