import React from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import App from "./App";
import { AppContextProvider } from "./context/AppContext";
import { ErrorPage } from "./pages/ErrorPage";

defineCustomElements(window);

TimeAgo.addDefaultLocale(en);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <AppContextProvider>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <App />
      </ErrorBoundary>
    </AppContextProvider>
  </React.StrictMode>,
);
