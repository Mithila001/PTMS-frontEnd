// src/utils/logFormatter.ts

import type { Log, DisplayLog } from "../types/logs";

/**
 * Parses and formats the timestamp and details of an action log for display.
 * @param logs The array of raw Log objects from the API.
 * @returns An array of formatted DisplayLog objects.
 */
export const formatLogsForDisplay = (logs: Log[]): DisplayLog[] => {
  return logs.map((log) => {
    // 1. Format the timestamp into separate date and time strings
    const date = new Date(log.timestamp);
    const formattedDate = date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // 2. Format the entityType for better readability
    const formattedEntityType = log.entityType
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // 3. Format the details string. If it's a JSON string, parse and format it with line breaks and bullet points.
    let formattedDetails = log.details;
    try {
      const changes = JSON.parse(log.details);
      if (Array.isArray(changes)) {
        formattedDetails = changes
          .map(
            (change) => `• ${change.attribute}: "${change.previousValue}" -> "${change.newValue}"`
          )
          .join("\n");
      }
    } catch (e) {
      // If parsing fails, it's not a JSON string, so we use the original details
    }

    return {
      id: log.id,
      date: formattedDate,
      time: formattedTime,
      username: log.username,
      actionType: log.actionType,
      entityType: formattedEntityType,
      entityId: log.entityId,
      details: formattedDetails,
    };
  });
};
