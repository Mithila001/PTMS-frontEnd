// src/api/assignmentService.ts

import type { Assignment } from "../types/assignment";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches a list of all assignments.
 * This function calls the GET /api/assignments endpoint to retrieve a list of all public transport assignments.
 * @returns A promise that resolves to an array of Assignment objects.
 */
export const getAllAssignments = async (): Promise<Assignment[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/assignments`, { credentials: "include" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Assignment[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch assignments:", error);
    throw error;
  }
};

/**
 * Fetches a single assignment by its ID.
 * This function calls the GET /api/assignments/{id} endpoint.
 * @param id The ID of the assignment to fetch.
 * @returns A promise that resolves to a single Assignment object or null if not found.
 */
export const getAssignmentById = async (id: number): Promise<Assignment | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/assignments/${id}`, { credentials: "include" });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Assignment | null = await response.json();
    console.log(`Fetched assignment with ID ${id}:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch assignment with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new assignment.
 * This function sends a POST request to the /api/assignments endpoint.
 * @param assignmentData The data for the new assignment, excluding the ID.
 * @returns A promise that resolves to the newly created Assignment object.
 */
export const createAssignment = async (
  assignmentData: Omit<Assignment, "id" | "scheduledTrip">
): Promise<Assignment> => {
  // Convert the Date objects to ISO string format
  const formattedPayload = {
    ...assignmentData,
    date: assignmentData.date?.toISOString().split("T")[0],
    actualStartTime: assignmentData.actualStartTime?.toISOString() || null,
    actualEndTime: assignmentData.actualEndTime?.toISOString() || null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/assignments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedPayload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newAssignment: Assignment = await response.json();
    return newAssignment;
  } catch (error) {
    console.error("Error creating new assignment:", error);
    throw error;
  }
};

/**
 * Updates an existing assignment.
 * This function sends a PUT request to the /api/assignments/{id} endpoint.
 * @param id The ID of the assignment to update.
 * @param assignmentDetails The data to update.
 * @returns A promise that resolves to the updated Assignment object.
 */
export const updateAssignment = async (
  id: number,
  assignmentDetails: Partial<Omit<Assignment, "scheduledTrip">>
): Promise<Assignment> => {
  try {
    const response = await fetch(`${API_BASE_URL}/assignments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assignmentDetails),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedAssignment: Assignment = await response.json();
    return updatedAssignment;
  } catch (error) {
    console.error(`Failed to update assignment with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes an assignment by its ID.
 * This function sends a DELETE request to the /api/assignments/{id} endpoint.
 * @param id The ID of the assignment to delete.
 * @returns A promise that resolves to a boolean indicating success.
 */
export const deleteAssignment = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/assignments/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error(`Failed to delete assignment with ID ${id}:`, error);
    throw new Error("Failed to delete assignment");
  }
};
