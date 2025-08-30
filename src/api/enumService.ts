// src/api/enumService.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchBusEnumServiceTypes = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/enums/bus-enum-serviceTypes`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: string[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch bus enum service types:", error);
    throw new Error("Failed to fetch bus enum service types");
  }
};

export const fetchBusEnumComfortTypes = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/enums/bus-enum-comfortTypes`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: string[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch bus enum comfort types:", error);
    throw new Error("Failed to fetch bus enum comfort types");
  }
};

export const fetchBusEnumFuelTypes = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/enums/bus-enum-fuelTypes`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: string[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch bus enum fuel types:", error);
    throw new Error("Failed to fetch bus enum fuel types");
  }
};
