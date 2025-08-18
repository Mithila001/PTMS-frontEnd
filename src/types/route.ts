export interface Route {
  id: number;
  routeNumber: string;
  origin: string;
  destination: string;
  majorStops: string[];
  routePath?: string;
}
