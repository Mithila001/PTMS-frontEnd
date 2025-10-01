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
  entityId: number;
  details: string;
}

export interface IChangeDetail {
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
}

export interface IAuditLog {
  revisionId: number;
  username: string;
  timestamp: string;
  entityId: number;
  revisionType: string;
  summary: string;
  changes: IChangeDetail[];
}
