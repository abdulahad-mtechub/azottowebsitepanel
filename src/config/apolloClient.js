import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { getAccessToken, clearAuthTokens } from "../utils/tokenManager";
import {
  refreshAccessToken,
  registerWSReconnect,
} from "../utils/tokenRefreshService";

const API_URL = "https://verify.jusoor-sa.co/graphql";

// HTTP Link
const httpLink = createHttpLink({
  uri: API_URL,
  credentials: "include",
});

// Auth Link (Attaches token with auto-refresh)
const authLink = setContext(async (_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer${token}` : "",
    },
  };
});

let wsLink;

const createWebSocketLink = () => {
  return new WebSocketLink({
    uri: "wss://verify.jusoor-sa.co/subscriptions",
    options: {
      reconnect: true,
      connectionParams: () => ({
        authorization: `Bearer${getAccessToken() || ""}`,
      }),
    },
  });
};

wsLink = createWebSocketLink();
const reconnectWebSocket = () => {
  try {
    // Close current connection
    if (wsLink?.subscriptionManager?.client) {
      wsLink.subscriptionManager.client.close(true);
    }

    // Create new connection with fresh token
    wsLink = createWebSocketLink();
    console.log("✅ WebSocket reconnected with new token");
  } catch (error) {
    console.error("⚠️ Error reconnecting WebSocket:", error);
  }
};

// Register the reconnect callback with token refresh service
registerWSReconnect(reconnectWebSocket);

// Split links: send subscriptions to wsLink, others to httpLink
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// Enhanced Error Handling Link with Token Refresh
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        console.error("[GraphQL Error]:", err.message);

        // Handle authentication errors - including context creation failures
        const isAuthError =
          err.message?.includes("Invalid or expired token") ||
          err.message?.includes("Invalid token or authentication failed") ||
          err.message?.includes("jwt expired") ||
          err.message?.includes("Context creation failed") ||
          err.message?.includes("Authentication required") ||
          err.message?.includes("Please provide a valid token") ||
          err.extensions?.code === "UNAUTHENTICATED";

        if (isAuthError) {
          console.log("🔄 Auth error detected, attempting token refresh...");

          // Attempt to refresh the token
          return new Promise((resolve) => {
            refreshAccessToken()
              .then((newToken) => {
                if (newToken) {
                  console.log("✅ Token refreshed, retrying request");
                  // Retry the failed request with new token
                  const oldHeaders = operation.getContext().headers;
                  operation.setContext({
                    headers: {
                      ...oldHeaders,
                      authorization: `Bearer${newToken}`,
                    },
                  });
                  resolve(forward(operation));
                } else {
                  // Refresh failed, clear auth and redirect
                  console.log("❌ Token refresh failed, logging out");
                  clearAuthTokens();
                  if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                  }
                  resolve();
                }
              })
              .catch((refreshError) => {
                // Refresh failed, clear auth and redirect
                console.log("❌ Token refresh error, logging out:", refreshError);
                clearAuthTokens();
                if (window.location.pathname !== "/login") {
                  window.location.href = "/login";
                }
                resolve();
              });
          });
        }

        // Handle other authorization errors
        if (err.extensions?.code === "FORBIDDEN") {
          console.error("Access forbidden:", err.message);
        }
      }
    }

    // Handle network errors
    if (networkError) {
      console.error("[Network Error]:", networkError);
      
      // Check if it's an authentication-related network error
      if (networkError.statusCode === 401 || networkError.statusCode === 403) {
        console.log("🔄 Network auth error detected, attempting token refresh...");
        return new Promise((resolve) => {
          refreshAccessToken()
            .then((newToken) => {
              if (newToken) {
                console.log("✅ Token refreshed, retrying request");
                resolve(forward(operation));
              } else {
                console.log("❌ Token refresh failed, logging out");
                clearAuthTokens();
                if (window.location.pathname !== "/login") {
                  window.location.href = "/login";
                }
                resolve();
              }
            })
            .catch((refreshError) => {
              console.log("❌ Token refresh error:", refreshError);
              clearAuthTokens();
              if (window.location.pathname !== "/login") {
                window.location.href = "/login";
              }
              resolve();
            });
        });
      }
    }
  }
);

export const client = new ApolloClient({
  link: from([errorLink, splitLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});
