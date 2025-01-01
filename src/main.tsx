import React from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { AppContextProvider } from "./context/AppContext";
import { ErrorPage } from "./pages/ErrorPage";
import App from "./App";

defineCustomElements(window);

TimeAgo.addDefaultLocale(en);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
