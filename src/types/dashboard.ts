export type DashboardMetrics = {
  totalActiveBuses: number;
  totalActiveDrivers: number;
  totalActiveConductors: number;
  totalRoutes: number;
  totalScheduledTrips: number;
  totalActiveAssignments: number;
};

export interface DashboardResponse {
  status: number;
  message: string;
  data: DashboardMetrics;
  errors: string | null;
  timestamp: string;
}
