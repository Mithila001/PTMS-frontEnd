import type { BaseResponse } from "./../types/common";
import type {
  NewUser,
  RegisteredUserResponse,
  UserResponse,
  UserUpdateRequest,
} from "../types/user";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllUsers = async (): Promise<UserResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, { credentials: "include" });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 200) {
      throw new Error(
        `API error: ${data.message} - ${
          data.errors ? JSON.stringify(data.errors) : "No details provided"
        }`
      );
    }
    return data.data as UserResponse[];
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const getUserById = async (id: string, signal?: AbortSignal): Promise<UserResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, { credentials: "include", signal });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BaseResponse<UserResponse> = await response.json();

    if (data.status !== 200) {
      throw new Error(
        `API error: ${data.message} - ${
          data.errors ? JSON.stringify(data.errors) : "No details provided"
        }`
      );
    }
    return data.data;
  } catch (error) {
    // Check if the error is an AbortError
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Fetch aborted");
      // Do not throw the error if it was a deliberate abort
      return Promise.reject(new Error("Request aborted"));
    }
    console.error(`Failed to fetch user with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUserById = async (id: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BaseResponse<string> = await response.json();

    if (data.status !== 200) {
      throw new Error(
        `API error: ${data.message} - ${
          data.errors ? JSON.stringify(data.errors) : "No details provided"
        }`
      );
    }
    return data.message;
  } catch (error) {
    console.error(`Failed to delete user with ID ${id}:`, error);
    throw error;
  }
};

export const createUser = async (newUser: NewUser): Promise<RegisteredUserResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BaseResponse<RegisteredUserResponse> = await response.json();

    if (data.status !== 200) {
      throw new Error(
        `API error: ${data.message} - ${
          data.errors ? JSON.stringify(data.errors) : "No details provided"
        }`
      );
    }
    return data.data;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

export const updateUser = async (id: string, updatedUser: UserResponse): Promise<UserResponse> => {
  const userUpdateRequest: UserUpdateRequest = {
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    nic: updatedUser.nic,
    roles: updatedUser.roles,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userUpdateRequest),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BaseResponse<UserResponse> = await response.json();

    if (data.status !== 200) {
      throw new Error(
        `API error: ${data.message} - ${
          data.errors ? JSON.stringify(data.errors) : "No details provided"
        }`
      );
    }
    return data.data;
  } catch (error) {
    console.error(`Failed to update user with ID ${id}:`, error);
    throw error;
  }
};
