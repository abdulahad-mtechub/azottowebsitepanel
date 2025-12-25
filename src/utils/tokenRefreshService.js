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
    console.log("⏳ Refresh already in progress, queuing request...");
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
  console.log("🔄 Starting token refresh...");

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
      console.log("✅ Token refreshed successfully");
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
      console.log("🚪 Redirecting to login...");
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

/**
 * Initialize authentication on app load
 * Handles the case where access token expired but refresh token still valid
 * This fixes the "stay logged in overnight" scenario
 */
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

/**
 * Auto-refresh setup - checks token validity every 2 minutes for proactive refresh
 * Call this on app initialization
 * Backend config: Access token = 10min, Refresh token = 234h
 * Auto-refresh triggers at 7 minutes (3 min before expiry)
 * Checks every 2 minutes - optimal balance between responsiveness and performance
 */
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

  console.log("✅ Auto-refresh started - checking token every 2 minutes");

  // Check token every 2 minutes (3-4 checks before 7-minute threshold)
  // Good balance between responsiveness and performance
  autoRefreshInterval = setInterval(async () => {
    if (isAuthenticated()) {
      if (shouldRefreshToken()) {
        console.log("⏰ Token approaching expiry, proactively refreshing...");
        await ensureValidToken();
      }
    } else {
      // Stop auto-refresh if user is not authenticated
      console.log("🛑 User not authenticated, stopping auto-refresh");
      stopAutoRefresh();
    }
  }, 2 * 60 * 1000); // 2 minutes - optimal balance

  return true;
};

export const stopAutoRefresh = () => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
  }
};

/**
 * Handle logout - clear tokens and stop auto-refresh
 */
export const handleLogout = () => {
  stopAutoRefresh();
  clearAuthTokens();
  window.location.href = "/login";
};
