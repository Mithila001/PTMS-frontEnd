/** * Formats a raw error object into a user-friendly message.
 * @param error The raw error object, can be an Error instance or any other object.
 * @returns A formatted string message for the user.
 */
export const formatErrorMessage = (error: unknown): string => {
  // Check if the error is a standard JavaScript Error object
  if (error instanceof Error) {
    // Return the message of the Error object
    return error.message;
  }

  // Handle cases where the error is a string or number
  if (typeof error === "string" || typeof error === "number") {
    return `An unexpected error occurred: ${error}`;
  }

  // Fallback for all other unknown error types
  return "An unknown error occurred. Please try again later.";
};
