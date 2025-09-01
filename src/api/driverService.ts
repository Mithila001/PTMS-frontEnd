import type { Driver, EmployeeSearchResult } from "../types/employee";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches a list of all drivers from the backend API.
 * @returns A promise that resolves to an array of Driver objects.
 */
export const getAllDrivers = async (): Promise<Driver[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers`, { credentials: "include" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Driver[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
    throw error;
  }
};

/**
 * Fetches a single driver by their ID.
 * @param id The ID of the driver to fetch.
 * @returns A promise that resolves to a Driver object or null if not found.
 */
export const getDriverById = async (id: number): Promise<Driver | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}`, { credentials: "include" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Driver = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch driver with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetches a single driver by their NIC number.
 * @param nicNumber The NIC number of the driver to fetch.
 * @returns A promise that resolves to a Driver object or null if not found.
 */
export const getDriverByNic = async (nicNumber: string): Promise<Driver> => {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers/nic/${nicNumber}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Driver = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch driver with NIC ${nicNumber}:`, error);
    throw error;
  }
};

/**
 * Creates a new driver.
 * @param driverData The new driver's data.
 * @returns A promise that resolves to the newly created Driver object.
 */
export const createDriver = async (driverData: Omit<Driver, "id">): Promise<Driver> => {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(driverData),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newDriver: Driver = await response.json();
    return newDriver;
  } catch (error) {
    console.error("Error creating new driver:", error);
    throw error;
  }
};

/**
 * Updates an existing driver.
 * @param id The ID of the driver to update.
 * @param driverDetails The updated driver data.
 * @returns A promise that resolves to the updated Driver object.
 */
export const updateDriver = async (id: number, driverDetails: Partial<Driver>): Promise<Driver> => {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(driverDetails),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedDriver: Driver = await response.json();
    return updatedDriver;
  } catch (error) {
    console.error(`Failed to update driver with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a driver by their ID.
 * @param id The ID of the driver to delete.
 * @returns A promise that resolves to true if the deletion was successful.
 */
export const deleteDriver = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error(`Failed to delete driver with ID ${id}:`, error);
    throw new Error("Failed to delete driver");
  }
};

export const searchDrivers = async (
  nicNumber?: string,
  name?: string,
  contactNumber?: string,
  licenseNumber?: string
): Promise<EmployeeSearchResult[]> => {
  const params = new URLSearchParams();
  if (nicNumber) params.append("nicNumber", nicNumber);
  if (name) params.append("name", name);
  if (contactNumber) params.append("contactNumber", contactNumber);
  if (licenseNumber) params.append("licenseNumber", licenseNumber);

  try {
    const response = await fetch(`${API_BASE_URL}/employees/drivers/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to search drivers");
    }
    return response.json();
  } catch (error) {
    console.error("Failed to search drivers:", error);
    throw error;
  }
};
