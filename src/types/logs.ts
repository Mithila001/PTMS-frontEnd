// src/types/logs.ts

/**
 * Represents the raw log data received from the backend API.
 */
export interface Log {
  id: number;
  timestamp: string;
  username: string;
  actionType: string;
  entityType: string;
  entityId: number | null;
  details: string;
}

/**
 * Represents the formatted log data for display in the table.
 */
export interface DisplayLog {
  id: number;
  date: string;
  time: string;
  username: string;
  actionType: string;
  entityType: string;
  entityId: number | null;
  details: string;
}
