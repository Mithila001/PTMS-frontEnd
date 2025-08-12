// src/api/enumService.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchBusTypes = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/enums/bus-types`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: string[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch bus types:", error);
    throw new Error("Failed to fetch bus types");
  }
};
