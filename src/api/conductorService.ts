import type { Conductor, PaginatedEmployeeResponse } from "../types/employee";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches a list of all conductors from the backend API.
 * @returns A promise that resolves to an array of Conductor objects.
 */
export const getAllConductors = async (): Promise<Conductor[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conductors`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Conductor[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch conductors:", error);
    throw error;
  }
};

/**
 * Fetches a single conductor by their ID.
 * @param id The ID of the conductor to fetch.
 * @returns A promise that resolves to a Conductor object or null if not found.
 */
export const getConductorById = async (id: number): Promise<Conductor | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conductors/${id}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Conductor = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch conductor with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetches a single conductor by their NIC number.
 * @param nicNumber The NIC number of the conductor to fetch.
 * @returns A promise that resolves to a Conductor object or null if not found.
 */
export const getConductorByNic = async (nicNumber: string): Promise<Conductor> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conductors/nic/${nicNumber}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Conductor = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch conductor with NIC ${nicNumber}:`, error);
    throw error;
  }
};

/**
 * Creates a new conductor.
 * @param conductorData The new conductor's data.
 * @returns A promise that resolves to the newly created Conductor object.
 */
export const createConductor = async (conductorData: Omit<Conductor, "id">): Promise<Conductor> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conductors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conductorData),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newConductor: Conductor = await response.json();
    return newConductor;
  } catch (error) {
    console.error("Error creating new conductor:", error);
    throw error;
  }
};

/**
 * Updates an existing conductor.
 * @param id The ID of the conductor to update.
 * @param conductorDetails The updated conductor data.
 * @returns A promise that resolves to the updated Conductor object.
 */
export const updateConductor = async (
  id: number,
  conductorDetails: Partial<Conductor>
): Promise<Conductor> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conductors/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conductorDetails),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedConductor: Conductor = await response.json();
    return updatedConductor;
  } catch (error) {
    console.error(`Failed to update conductor with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a conductor by their ID.
 * @param id The ID of the conductor to delete.
 * @returns A promise that resolves to true if the deletion was successful.
 */
export const deleteConductor = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conductors/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error(`Failed to delete conductor with ID ${id}:`, error);
    throw new Error("Failed to delete conductor");
  }
};

export const searchConductors = async (
  page: number,
  size: number,
  nicNumber?: string,
  name?: string,
  contactNumber?: string,
  licenseNumber?: string,
  signal?: AbortSignal
): Promise<PaginatedEmployeeResponse> => {
  const params = new URLSearchParams();
  if (nicNumber) params.append("nicNumber", nicNumber);
  if (name) params.append("name", name);
  if (contactNumber) params.append("contactNumber", contactNumber);
  if (licenseNumber) params.append("licenseNumber", licenseNumber);
  params.append("page", page.toString());
  params.append("size", size.toString());

  try {
    const response = await fetch(
      `${API_BASE_URL}/employees/conductors/search?${params.toString()}`,
      { signal }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to search conductors");
    }
    return response.json();
  } catch (error) {
    console.error("Failed to search conductors:", error);
    throw error;
  }
};
