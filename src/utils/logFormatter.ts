// src/utils/logFormatter.ts

import type { IAuditLog, DisplayLog, IChangeDetail } from "../types/logs";

/**
 * Helper function to create a detailed, multi-line string from the list of change details.
 * @param changes The array of change details from the audit log.
 * @returns A formatted string summarizing the changes.
 */
const formatChangeDetails = (changes: IChangeDetail[]): string => {
  if (!changes || changes.length === 0) {
    return "No specific details available.";
  }

  // Use a map to create a bullet point string for each change
  return changes
    .map((change) => {
      const field = change.fieldName.charAt(0).toUpperCase() + change.fieldName.slice(1);
      const oldValue = change.oldValue ?? "N/A"; // Use nullish coalescing for null
      const newValue = change.newValue ?? "N/A"; // Use nullish coalescing for null

      return `• ${field}: Changed from "${oldValue}" to "${newValue}"`;
    })
    .join("\n");
};

/**
 * Parses and formats the IAuditLog data structure for display in the Logs page DataTable.
 * @param logs The array of raw IAuditLog objects from the API.
 * @returns An array of formatted DisplayLog objects.
 */
export const formatLogsForDisplay = (logs: IAuditLog[]): DisplayLog[] => {
  return logs.map((log) => {
    // 1. Format the timestamp into separate date and time strings
    const dateObject = new Date(log.timestamp);
    const formattedDate = dateObject.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const formattedTime = dateObject.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // 2. Format the revisionType for the actionType column
    // The revisionType from Spring Data Envers (0=ADD, 1=MOD, 2=DEL) can be mapped to strings.
    // Assuming the backend maps them to strings like "CREATED", "UPDATED", "DELETED".
    const actionTypeMap: Record<string, string> = {
      ADD: "CREATED",
      MOD: "UPDATED",
      DEL: "DELETED",
      // Add more as needed, or use the raw type if backend is already user-friendly
    };
    const actionType = actionTypeMap[log.revisionType] || log.revisionType;

    // 3. Determine the Entity Type from the summary or a dedicated field (if available).
    // The summary often contains the entity name (e.g., "Bus 101 was updated").
    // For this implementation, we will try to extract it from the summary,
    // otherwise we might need a dedicated field from the backend.
    // For now, let's use a simple placeholder derived from the summary.
    const entityTypeMatch = log.summary.match(/(Bus|Route|Employee|User)/i);
    const entityType = entityTypeMatch ? entityTypeMatch[0] : "System";

    // 4. Format the details field by combining the summary and detailed changes.
    const changeDetails = formatChangeDetails(log.changes);
    const formattedDetails = `${log.summary}\n${changeDetails}`;

    return {
      // Maps revisionId to id for the primary key in the table
      id: log.revisionId,
      date: formattedDate,
      time: formattedTime,
      username: log.username,
      actionType: actionType,
      entityType: entityType,
      entityId: log.entityId,
      details: formattedDetails,
    };
  });
};
