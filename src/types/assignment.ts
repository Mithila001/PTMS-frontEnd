// src/types/assignment.ts

import type { Route } from "./route";

export type AssignmentStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
export type TripDirection = "TO" | "FROM";

export interface ScheduledTrip {
  id: number;
  route: Route;
  direction: TripDirection;
  expectedStartTime: string; // "HH:mm:ss" string
  expectedEndTime: string; // "HH:mm:ss" string
}

export interface Assignment {
  id: number;
  scheduledTrip: ScheduledTrip;
  busId: number;
  driverId: number;
  conductorId: number;
  date: string;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
  status: AssignmentStatus;
  driverName?: string;
  conductorName?: string;
  busRegistrationNumber?: string;
}
