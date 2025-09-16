/**
 * Converts a JavaScript Date object to a Spring Boot-compatible date-time string
 * in ISO 8601 format (e.g., "2023-09-16T10:30:00.000Z").
 *
 * @param date - The JavaScript Date object to convert.
 * @returns A string formatted for a Spring Boot backend, or null if the input is not a valid date.
 */
export function reactDateToSpringBootString(date: Date | null): string | null {
  if (date === null || isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

/**
 * Converts a Spring Boot-compatible date-time string (ISO 8601) to a JavaScript Date object.
 *
 * @param isoString - The ISO 8601 formatted string from the backend (e.g., "2023-09-16T10:30:00.000Z").
 * @returns A new JavaScript Date object, or null if the input string is invalid.
 */
export function springBootStringToReactDate(isoString: string | null): Date | null {
  if (isoString === null) {
    return null;
  }

  const date = new Date(isoString);

  // Check if the created date object is valid
  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
}
