// src/types/assignment.ts

import type { Route } from "./route";

export type AssignmentStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
export type TripDirection = "TO" | "FROM";

export interface ScheduledTrip {
  id: number;
  route: Route;
  direction: TripDirection;
  expectedStartTime: Date | null;
  expectedEndTime: Date | null;
}

export interface Assignment {
  id: number;
  scheduledTripId: string;
  busId: number;
  driverId: number;
  conductorId: number;
  date: Date | null;
  actualStartTime?: Date | null;
  actualEndTime?: Date | null;
  status: AssignmentStatus;
  driverName?: string;
  conductorName?: string;
  busRegistrationNumber?: string;
}
