import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { ToastProvider } from "./contexts/ToastContext.tsx";
import ToastContainer from "./components/atoms/ToastContainer.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ApplicationDataProvider as ApplicationDataContextType } from "./contexts/ApplicationDataContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ApplicationDataContextType>
            <App />
          </ApplicationDataContextType>
        </AuthProvider>
        <ToastContainer />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
