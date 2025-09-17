// F:\OnGoinProject\Transport Management System\ptms-frontEnd\src\types\user.ts

/**
 * Represents the structure of a user object returned from the backend.
 * This includes basic user information and a list of their roles.
 */
export type Role = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  username: string;
  roles: Role[];
};

/**
 * Represents the credentials needed for user login.
 */
export type UserCredentials = {
  username: string;
  password: string;
};

export interface UserResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  nic: string;
  roles: string[];
}

export interface UserUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  nic: string;
  roles: string[];
}

export interface NewUser extends Omit<UserResponse, "id" | "username"> {}

export interface RegisteredUserResponse {
  username: string;
  password: string;
  message: string;
}
