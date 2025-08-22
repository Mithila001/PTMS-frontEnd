// F:\OnGoinProject\Transport Management System\ptms-frontEnd\src\api\authService.ts

import type { User, UserCredentials } from "../types/user";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Handles the user login process by sending a POST request to the backend.
 * @param credentials - An object containing the user's username and password.
 * @returns A Promise that resolves to the authenticated User object.
 * @throws An error if the login fails due to incorrect credentials or a network issue.
 */
export const login = async (credentials: UserCredentials): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // The credentials: 'include' option is crucial for session-based authentication
      // It ensures that cookies are sent with the request and received in the response.
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      // Check for specific status codes like 401 (Unauthorized)
      if (response.status === 401) {
        throw new Error("Invalid username or password");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: User = await response.json();
    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error; // Re-throw the error so the calling component can handle it
  }
};

/**
 * Fetches the details of the currently authenticated user.
 * This is used to check if a user is logged in and retrieve their data (e.g., roles).
 * @returns A Promise that resolves to the User object or null if not authenticated.
 */
export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 401) {
      // If the user is not authenticated, the backend returns a 401.
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: User = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
};

/**
 * Logs the user out by invalidating their session on the backend.
 * @returns A Promise that resolves when the logout is successful.
 */
export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};
