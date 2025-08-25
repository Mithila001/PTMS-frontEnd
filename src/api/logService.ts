// src/api/logService.ts
import type { Log } from "../types/logs";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches all system logs from the backend.
 * @returns A promise that resolves to an array of Log objects.
 * @throws An error if the network request fails or the server responds with a non-OK status.
 */
export const getAllLogs = async (): Promise<Log[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/logs`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Log[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

/**
 * Fetches logs filtered by a specific entity type.
 * @param entityType The type of entity to filter by (e.g., "BUS", "ROUTE").
 * @returns A promise that resolves to an array of Log objects.
 * @throws An error if the network request fails or the server responds with a non-OK status.
 */
export const getLogsByEntityType = async (entityType: string): Promise<Log[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/logs/filter/entity/${entityType}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Log[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch logs for entity type ${entityType}:`, error);
    throw error;
  }
};

/**
 * Fetches logs filtered by both username and entity type.
 * @param username The username to filter by.
 * @param entityType The type of entity to filter by.
 * @returns A promise that resolves to an array of Log objects.
 * @throws An error if the network request fails or the server responds with a non-OK status.
 */
export const getLogsByUsernameAndEntityType = async (
  username: string,
  entityType: string
): Promise<Log[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/logs/filter/user/${username}/entity/${entityType}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Log[] = await response.json();
    return data;
  } catch (error) {
    console.error(
      `Failed to fetch logs for user ${username} and entity type ${entityType}:`,
      error
    );
    throw error;
  }
};
