import type { Route } from "../../types/route";

// A mock database to simulate data storage on the backend
const mockRoutes: Route[] = [
  {
    id: 1,
    routeNumber: "138",
    origin: "Colombo",
    destination: "Maharagama",
    majorStops: ["Nugegoda", "Delkanda", "Pannipitiya"],
    routePath: "LINESTRING (79.8612 6.9271, 79.9198 6.8795, 79.9234 6.8407)",
  },
  {
    id: 2,
    routeNumber: "120",
    origin: "Piliyandala",
    destination: "Pettah",
    majorStops: ["Maharagama", "Nugegoda", "Borella"],
    routePath: "LINESTRING (79.9168 6.8207, 79.9213 6.8450, 79.9281 6.8923)",
  },
];

let nextId = mockRoutes.length + 1;

/**
 * Mocks an API call to create a new route.
 * It simulates a successful network request and adds the new route to our mock database.
 * @param newRoute - The new route data to be created.
 * @returns A promise that resolves with the created route data, including a new ID.
 */
/**
 * Mocks an API call to create a new route.
 * It simulates a successful network request and adds the new route to our mock database.
 * @param newRoute - The new route data to be created.
 * @returns A promise that resolves with the created route data, including a new ID.
 */
export const createRouteMock = async (newRoute: Omit<Route, "id">): Promise<Route> => {
  // Simulates a network delay of 500ms
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Perform a check for the route path before attempting creation
      if (!newRoute.routePath) {
        reject(new Error("Route path is a required field."));
        return;
      }

      // Explicitly define the createdRoute to satisfy the `Route` type
      const createdRoute: Route = {
        id: nextId++,
        ...newRoute,
        // The non-null assertion operator (!) tells TypeScript that this value will not be null or undefined.
        // We can safely use this because of the check above.
        routePath: newRoute.routePath!,
      };

      mockRoutes.push(createdRoute);
      console.log("Mock API: Route created successfully.", createdRoute);
      resolve(createdRoute);
    }, 500);
  });
};

/**
 * Mocks an API call to get a route by its ID.
 * @param id The ID of the route to retrieve.
 * @returns A promise that resolves with the route data or null if not found.
 */
export const getRouteById = async (id: number): Promise<Route | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const route = mockRoutes.find((r) => r.id === id);
      console.log(`Mock API: Fetched route with ID ${id}.`, route);
      resolve(route || null);
    }, 300);
  });
};

/**
 * Mocks an API call to update an existing route.
 * @param id The ID of the route to update.
 * @param updatedData The data to update the route with.
 * @returns A promise that resolves with the updated route data.
 */
export const updateRoute = async (id: number, updatedData: Route): Promise<Route> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockRoutes.findIndex((r) => r.id === id);
      if (index !== -1) {
        mockRoutes[index] = { ...mockRoutes[index], ...updatedData };
        console.log(`Mock API: Route with ID ${id} updated.`);
        resolve(mockRoutes[index]);
      } else {
        reject(new Error(`Route with ID ${id} not found.`));
      }
    }, 500);
  });
};

/**
 * Mocks an API call to delete a route.
 * @param id The ID of the route to delete.
 * @returns A promise that resolves upon successful deletion.
 */
export const deleteRoute = async (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = mockRoutes.length;
      const filteredRoutes = mockRoutes.filter((r) => r.id !== id);

      if (filteredRoutes.length < initialLength) {
        // You'll need to re-assign the filtered array to the mockRoutes array in a real scenario to "persist" the changes.
        // For this example, we'll just log and assume a successful deletion.
        console.log(`Mock API: Route with ID ${id} deleted.`);
        resolve();
      } else {
        reject(new Error(`Route with ID ${id} not found.`));
      }
    }, 500);
  });
};

// ... add other mock API functions if needed
