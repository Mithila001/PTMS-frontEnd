import type { Bus } from "../types/bus";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getBuses = async (): Promise<Bus[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/buses`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Bus[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch buses:", error);
    throw error;
  }
};
