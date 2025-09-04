// src/api/scheduledTripService.ts

import type { ScheduledTrip, TripDirection } from "../types/assignment";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches a list of all scheduled trips.
 * This function calls the GET /api/scheduled-trips endpoint.
 * @returns A promise that resolves to an array of ScheduledTrip objects.
 */
export const getAllScheduledTrips = async (): Promise<ScheduledTrip[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/scheduled-trips`, { credentials: "include" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ScheduledTrip[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch scheduled trips:", error);
    throw error;
  }
};

/**
 * Fetches a single scheduled trip by its ID.
 * This function calls the GET /api/scheduled-trips/{id} endpoint.
 * @param id The ID of the scheduled trip to fetch.
 * @returns A promise that resolves to a single ScheduledTrip object or null if not found.
 */
export const getScheduledTripById = async (id: number): Promise<ScheduledTrip | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/scheduled-trips/${id}`, {
      credentials: "include",
    });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Convert time strings to Date objects before returning
    const parsedData: ScheduledTrip = {
      ...data,
      expectedStartTime: parseTimeFromAPI(data.expectedStartTime),
      expectedEndTime: parseTimeFromAPI(data.expectedEndTime),
    };

    return parsedData;
  } catch (error) {
    console.error(`Failed to fetch scheduled trip with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new scheduled trip.
 * This function sends a POST request to the /api/scheduled-trips endpoint.
 * @param scheduledTripData The data for the new scheduled trip, excluding the ID.
 * @returns A promise that resolves to the newly created ScheduledTrip object.
 */
export const createScheduledTrip = async (
  scheduledTripData: Omit<ScheduledTrip, "id">
): Promise<ScheduledTrip> => {
  try {
    // Convert Date objects to "HH:mm:ss" strings for the backend
    const formattedData = {
      ...scheduledTripData,
      expectedStartTime: formatTimeForAPI(scheduledTripData.expectedStartTime),
      expectedEndTime: formatTimeForAPI(scheduledTripData.expectedEndTime),
    };

    const response = await fetch(`${API_BASE_URL}/scheduled-trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newScheduledTrip: ScheduledTrip = await response.json();
    return newScheduledTrip;
  } catch (error) {
    console.error("Error creating new scheduled trip:", error);
    throw error;
  }
};

/**
 * Updates an existing scheduled trip.
 * This function sends a PUT request to the /api/scheduled-trips/{id} endpoint.
 * @param id The ID of the scheduled trip to update.
 * @param scheduledTripDetails The data to update.
 * @returns A promise that resolves to the updated ScheduledTrip object.
 */
export const updateScheduledTrip = async (
  id: number,
  scheduledTripDetails: Partial<ScheduledTrip>
): Promise<ScheduledTrip> => {
  try {
    const formattedData = {
      ...scheduledTripDetails,
      expectedStartTime: scheduledTripDetails.expectedStartTime
        ? formatTimeForAPI(scheduledTripDetails.expectedStartTime)
        : null,
      expectedEndTime: scheduledTripDetails.expectedEndTime
        ? formatTimeForAPI(scheduledTripDetails.expectedEndTime)
        : null,
    };

    const response = await fetch(`${API_BASE_URL}/scheduled-trips/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedScheduledTrip: ScheduledTrip = await response.json();
    return updatedScheduledTrip;
  } catch (error) {
    console.error(`Failed to update scheduled trip with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a scheduled trip by its ID.
 * This function sends a DELETE request to the /api/scheduled-trips/{id} endpoint.
 * @param id The ID of the scheduled trip to delete.
 * @returns A promise that resolves to a boolean indicating success.
 */
export const deleteScheduledTrip = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/scheduled-trips/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error(`Failed to delete scheduled trip with ID ${id}:`, error);
    throw new Error("Failed to delete scheduled trip");
  }
};

/**
 * Searches for scheduled trips based on optional criteria.
 * This function calls the GET /api/scheduled-trips/search-trips endpoint.
 * @param scheduledTripId The ID of the scheduled trip to search for (optional).
 * @param direction The trip direction to search for ("UP" or "DOWN") (optional).
 * @returns A promise that resolves to an array of matching ScheduledTrip objects.
 */
export const searchScheduledTrips = async (
  scheduledTripId?: string,
  direction?: TripDirection
): Promise<ScheduledTrip[]> => {
  try {
    const params = new URLSearchParams();
    if (scheduledTripId) {
      params.append("scheduledTripId", scheduledTripId);
    }
    if (direction) {
      params.append("direction", direction);
    }

    const response = await fetch(
      `${API_BASE_URL}/scheduled-trips/search-trips?${params.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ScheduledTrip[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to search scheduled trips:", error);
    throw error;
  }
};

// Helper function to format a Date object into a "HH:mm:ss" string.
const formatTimeForAPI = (date: Date | null): string | null => {
  if (!date) {
    return null;
  }
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const parseTimeFromAPI = (timeString: string | null): Date | null => {
  if (!timeString) {
    return null;
  }
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds, 0);
  return date;
};
