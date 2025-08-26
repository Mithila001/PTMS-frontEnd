// src/types/assignment.ts

// src/types/assignment.ts
import type { Bus } from "./bus";
import type { Driver, Conductor } from "./employee";
import type { Route } from "./route";

export type AssignmentStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";

export interface ScheduledTrip {
  id: number;
  route: Route;
  bus: Bus;
  driver: Driver;
  conductor: Conductor;
  scheduledStartTime: string; // ISO 8601 string
  scheduledEndTime: string; // ISO 8601 string
  active: boolean;
}

export interface Assignment {
  id: number;
  scheduledTrip: ScheduledTrip;
  busId: number;
  driverId: number;
  conductorId: number;
  date: string; // ISO 8601 string
  actualStartTime?: string; // Optional field
  actualEndTime?: string; // Optional field
  status: AssignmentStatus;
}
