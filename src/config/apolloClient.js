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
import { refreshAccessToken } from "../utils/tokenRefreshService";

const API_URL = "https://verify.jusoor-sa.co/graphql";

// HTTP Link
const httpLink = createHttpLink({
  uri: API_URL,
  credentials: "include",
});

// Auth Link (Attaches token with auto-refresh)
const authLink = setContext(async (_, { headers }) => {
  let token = getAccessToken();

  // If no token, try to get it (could be in cookies)
  if (!token) {
    token = getAccessToken();
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// WebSocket link for subscriptions
const wsLink = new WebSocketLink({
  uri: "wss://verify.jusoor-sa.co/subscriptions",
  options: {
    reconnect: true,
    connectionParams: () => ({
      authorization: `Bearer ${getAccessToken() || ""}`,
    }),
  },
});

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
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.error("[GraphQL Error]:", err.message);

      // Handle authentication errors
      if (
        err.message?.includes("Invalid or expired token") ||
        err.message?.includes("Invalid token or authentication failed") ||
        err.message?.includes("jwt expired") ||
        err.extensions?.code === "UNAUTHENTICATED"
      ) {
        // Attempt to refresh the token
        return new Promise((resolve) => {
          refreshAccessToken()
            .then((newToken) => {
              if (newToken) {
                // Retry the failed request with new token
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${newToken}`,
                  },
                });
                resolve(forward(operation));
              } else {
                // Refresh failed, clear auth and redirect
                clearAuthTokens();
                if (window.location.pathname !== "/login") {
                  window.location.href = "/";
                }
                resolve();
              }
            })
            .catch(() => {
              // Refresh failed, clear auth and redirect
              clearAuthTokens();
              if (window.location.pathname !== "/login") {
                window.location.href = "/";
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
});

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
