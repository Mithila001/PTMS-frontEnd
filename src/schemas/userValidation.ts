// File: src/schemas/userValidation.ts

import type { UserResponse } from "../types/user";

// Brief Explanation: We're defining the specific validation rules for each user field.
// The `useValidation` hook will read these rules to check the form data.
export const userValidationSchema: Partial<Record<keyof UserResponse, any>> = {
  username: {
    required: true,
    minLength: 3,
  },
  firstName: {
    required: true,
    minLength: 3,
  },
  lastName: {
    required: true,
    minLength: 3,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: "Please enter a valid email address.",
  },
  nic: {
    required: true,
    pattern: /^(\d{9}[vVxX]|\d{12})$/,
    errorMessage: "Please enter a valid Sri Lankan NIC number.",
  },
  roles: {
    required: true,
  },
};
