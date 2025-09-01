import type { EmployeeSearchResult } from "../types/employee";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const searchAllEmployees = async (
  nicNumber?: string,
  name?: string,
  contactNumber?: string
): Promise<EmployeeSearchResult[]> => {
  const params = new URLSearchParams();
  if (nicNumber) params.append("nicNumber", nicNumber);
  if (name) params.append("name", name);
  if (contactNumber) params.append("contactNumber", contactNumber);

  try {
    const response = await fetch(`${API_BASE_URL}/employees/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to search all employees");
    }
    return response.json();
  } catch (error) {
    console.error("Failed to search all employees:", error);
    throw error;
  }
};
