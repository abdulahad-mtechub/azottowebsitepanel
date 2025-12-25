import Cookies from "js-cookie";

const TOKEN_CONFIG = {
  // Access token expires in 10 minutes (backend: '10m')
  ACCESS_TOKEN_EXPIRY: 10 / (24 * 60), // 10 minutes in days
  // Refresh token expires in 234 hours ≈ 9.75 days (backend: '234h')
  REFRESH_TOKEN_EXPIRY: 234 / 24, // 234 hours in days (9.75 days)
  // User data expiry (same as refresh token)
  USER_DATA_EXPIRY: 234 / 24, // 234 hours in days (9.75 days)

  // Cookie options - secure only in production (HTTPS)
  SECURE_OPTIONS: {
    secure: window.location.protocol === "https:", // Only use secure flag on HTTPS
    sameSite: "strict", // CSRF protection
  },
};

const encryptToken = (token) => {
  if (!token) return "";
  const key = "J@$00r-S3cur3-K3y-2025"; // Should be in env variable
  let encrypted = "";
  for (let i = 0; i < token.length; i++) {
    encrypted += String.fromCharCode(
      token.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return btoa(encrypted); // Base64 encode
};

const decryptToken = (encrypted) => {
  if (!encrypted) return "";
  try {
    const key = "J@$00r-S3cur3-K3y-2025";
    const decoded = atob(encrypted);
    let decrypted = "";
    for (let i = 0; i < decoded.length; i++) {
      decrypted += String.fromCharCode(
        decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return decrypted;
  } catch (error) {
    console.error("Token decryption failed:", error);
    return "";
  }
};

export const setAuthTokens = (accessToken, refreshToken, user) => {
  try {
    // Encrypt and store access token (short-lived)
    Cookies.set("_at", encryptToken(accessToken), {
      expires: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY,
      ...TOKEN_CONFIG.SECURE_OPTIONS,
    });

    // Encrypt and store refresh token (longer-lived)
    // SECURITY: In production, this should be httpOnly cookie set by backend
    Cookies.set("_rt", encryptToken(refreshToken), {
      expires: TOKEN_CONFIG.REFRESH_TOKEN_EXPIRY,
      ...TOKEN_CONFIG.SECURE_OPTIONS,
    });

    // Store user data (non-sensitive, can be plaintext)
    if (user) {
      Cookies.set("userId", user.id, {
        expires: TOKEN_CONFIG.USER_DATA_EXPIRY,
      });

      Cookies.set("userStatus", user.status, {
        expires: TOKEN_CONFIG.USER_DATA_EXPIRY,
      });
    }

    // Set token refresh timestamp
    Cookies.set("tokenRefreshedAt", new Date().toISOString(), {
      expires: TOKEN_CONFIG.USER_DATA_EXPIRY,
    });

    return true;
  } catch (error) {
    console.error("❌ Error setting auth tokens:", error);
    return false;
  }
};

export const getAccessToken = () => {
  const encrypted = Cookies.get("_at");
  return encrypted ? decryptToken(encrypted) : null;
};

export const getRefreshToken = () => {
  const encrypted = Cookies.get("_rt");
  return encrypted ? decryptToken(encrypted) : null;
};

export const getUserId = () => {
  return Cookies.get("userId") || null;
};

export const getUserStatus = () => {
  return Cookies.get("userStatus") || null;
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const hasValidSession = () => {
  return !!getAccessToken() || !!getRefreshToken();
};

export const hasRefreshToken = () => {
  return !!getRefreshToken();
};

export const clearAuthTokens = () => {
  try {
    // Remove all auth-related cookies (using new encrypted names)
    Cookies.remove("_at"); // access token
    Cookies.remove("_rt"); // refresh token
    Cookies.remove("userId");
    Cookies.remove("userStatus");
    Cookies.remove("tokenRefreshedAt");

    // Also remove old cookie names for backward compatibility
    Cookies.remove("_at");
    Cookies.remove("_rt");

    // Clear localStorage as fallback
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return true;
  } catch (error) {
    console.error("Error clearing auth tokens:", error);
    return false;
  }
};
export const shouldRefreshToken = () => {
  const lastRefresh = Cookies.get("tokenRefreshedAt");

  if (!lastRefresh) {
    return true; // No refresh timestamp, should refresh
  }

  try {
    const lastRefreshTime = new Date(lastRefresh);
    const now = new Date();
    const minutesSinceRefresh = (now - lastRefreshTime) / (1000 * 60);

    // Refresh if more than 7 minutes have passed (token expires in 10 minutes)
    // This gives 3 minutes buffer before actual expiration
    const shouldRefresh = minutesSinceRefresh > 7;

    if (shouldRefresh) {
      console.log(
        `⏱️ Token age: ${minutesSinceRefresh.toFixed(
          1
        )} minutes - refresh needed`
      );
    }

    return shouldRefresh;
  } catch (error) {
    console.error("Error checking token refresh time:", error);
    return true; // On error, trigger refresh to be safe
  }
};

export const getUserData = () => {
  return {
    id: getUserId(),
    status: getUserStatus(),
    isAuthenticated: isAuthenticated(),
    hasRefreshToken: hasRefreshToken(),
  };
};

export const updateAccessToken = (newAccessToken) => {
  try {
    Cookies.set("_at", encryptToken(newAccessToken), {
      expires: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY,
      ...TOKEN_CONFIG.SECURE_OPTIONS,
    });

    // Update refresh timestamp
    Cookies.set("tokenRefreshedAt", new Date().toISOString(), {
      expires: TOKEN_CONFIG.USER_DATA_EXPIRY,
    });

    return true;
  } catch (error) {
    console.error("Error updating access token:", error);
    return false;
  }
};
