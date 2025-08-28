// src/contexts/ApplicationDataContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { fetchBusTypes } from "../api/enumService";
import { useToast } from "./ToastContext";

interface ApplicationDataContextType {
  enums: {
    serviceType: string[];
  };
  loading: boolean;
  error: string | null;
}

const ApplicationDataContext = createContext<ApplicationDataContextType | undefined>(undefined);

export const ApplicationDataProvider = ({ children }: { children: ReactNode }) => {
  const [enums, setEnums] = useState<ApplicationDataContextType["enums"]>({ serviceType: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const serviceTypesData = await fetchBusTypes();
        setEnums((prevEnums) => ({ ...prevEnums, serviceType: serviceTypesData }));
      } catch (err) {
        setError("Failed to fetch service types.");
        showToast("Failed to load application data. Please refresh.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchEnums();
  }, [showToast]);

  return (
    <ApplicationDataContext.Provider value={{ enums, loading, error }}>
      {children}
    </ApplicationDataContext.Provider>
  );
};

export const useApplicationData = () => {
  const context = useContext(ApplicationDataContext);
  if (context === undefined) {
    throw new Error("useApplicationData must be used within an ApplicationDataProvider");
  }
  return context;
};
