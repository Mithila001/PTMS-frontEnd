import type { Bus } from "../types/bus";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// API_BASE_URL = /api

export const getBuses = async (): Promise<Bus[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/buses`, { credentials: "include" });
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

export const getBusById = async (id: string): Promise<Bus | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/buses/${id}`, { credentials: "include" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Bus | null = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch bus:", error);
    throw error;
  }
};

export const updateBus = async (id: string, busDetails: Partial<Bus>): Promise<Bus> => {
  try {
    const response = await fetch(`${API_BASE_URL}/buses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(busDetails),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedBus: Bus = await response.json();
    return updatedBus;
  } catch (error) {
    console.error("Failed to update bus:", error);
    throw error;
  }
};

export const deleteBus = async (id: string): Promise<Boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/buses/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to delete bus:", error);
    throw new Error("Failed to delete bus");
  }
};

export const addBus = async (busData: Omit<Bus, "id">): Promise<Bus> => {
  try {
    const response = await fetch(`${API_BASE_URL}/buses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(busData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedBus: Bus = await response.json();
    return updatedBus;
  } catch (error) {
    console.error("Error adding new bus:", error);
    // It's good practice to re-throw the error so the calling component can handle it
    throw error;
  }
};
