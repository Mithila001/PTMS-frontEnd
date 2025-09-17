// src/contexts/ApplicationDataContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  fetchBusEnumServiceTypes,
  fetchBusEnumComfortTypes,
  fetchBusEnumFuelTypes,
  fetchUserEnumRoles,
} from "../api/enumService";
import { useToast } from "./ToastContext";

interface ApplicationDataContextType {
  enums: {
    serviceType: string[];
    comfortType: string[];
    fuelType: string[];
    userRoles: string[];
  };
  loading: boolean;
  error: string | null;
}

const ApplicationDataContext = createContext<ApplicationDataContextType | undefined>(undefined);

export const ApplicationDataProvider = ({ children }: { children: ReactNode }) => {
  const [enums, setEnums] = useState<ApplicationDataContextType["enums"]>({
    serviceType: [],
    comfortType: [],
    fuelType: [],
    userRoles: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const [serviceTypesData, comfortTypesData, fuelTypesData, userRolesData] =
          await Promise.all([
            fetchBusEnumServiceTypes(),
            fetchBusEnumComfortTypes(),
            fetchBusEnumFuelTypes(),
            fetchUserEnumRoles(),
          ]);

        setEnums({
          serviceType: serviceTypesData,
          comfortType: comfortTypesData,
          fuelType: fuelTypesData,
          userRoles: userRolesData,
        });
      } catch (err) {
        setError("Failed to fetch application data.");
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
