// src/api/logService.ts
import type { IAuditLog } from "../types/logs";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches a list of the most recent global audit logs from the backend.
 * This corresponds to the '/api/audit/recent' endpoint.
 *
 * @returns A promise that resolves to an array of IAuditLog objects.
 * @throws An error if the network request fails or the server responds with a non-OK status.
 */
export const getRecentGlobalAuditLogs = async (): Promise<IAuditLog[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/audit/recent`, {
      credentials: "include", // Essential for sending cookies (e.g., session, authentication)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // The data is an array of IAuditLog objects
    const data: IAuditLog[] = await response.json();
    console.log("Fetched recent audit logs successfully.");
    return data;
  } catch (error) {
    // Re-throw the error for the calling component to handle
    console.error("Failed to fetch recent audit logs:", error);
    throw error;
  }
};
