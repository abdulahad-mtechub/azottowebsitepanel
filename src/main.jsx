import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ApolloProvider } from "@apollo/client";
import { client } from "./config/apolloClient";
import "./i18n";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Web3Provider } from "./web3/Web3Provider.jsx";
import { PrivyCustomProvider } from "./privy/PrivyProvider.jsx";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);

createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <StrictMode>
      <PrivyCustomProvider>
      <Web3Provider>
      <App />
      </Web3Provider>
      </PrivyCustomProvider>
    </StrictMode>
  </ApolloProvider>
);
