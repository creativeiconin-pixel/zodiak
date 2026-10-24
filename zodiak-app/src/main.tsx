import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { OfflineBanner } from "./components/pwa/OfflineBanner";
import { UpdateToast } from "./components/pwa/UpdateToast";
import { LanguageProvider } from "./i18n";
import { SessionProvider } from "./lib/session";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <LanguageProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
        <OfflineBanner />
        <UpdateToast />
      </LanguageProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
