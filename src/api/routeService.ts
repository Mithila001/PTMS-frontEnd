import type { Route } from "../types/route";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ROUTES_API_URL = `${API_BASE_URL}/routes`;

// Fetches all bus routes from the backend.
export const getAllRoutes = async (): Promise<Route[]> => {
  try {
    const response = await fetch(ROUTES_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Route[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch routes:", error);
    throw error;
  }
};

// Fetches a single bus route by its ID.
export const getRouteById = async (id: number): Promise<Route> => {
  try {
    const response = await fetch(`${ROUTES_API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Route = await response.json();
    //console.log(`Fetched route with ID ${id}:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch route with id ${id}:`, error);
    throw error;
  }
};

// Fetches a single bus route by its route number.
export const getRouteByNumber = async (routeNumber: string): Promise<Route> => {
  try {
    const response = await fetch(`${ROUTES_API_URL}/number/${routeNumber}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Route = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch route with number ${routeNumber}:`, error);
    throw error;
  }
};

// Creates a new bus route.
export const createRoute = async (routeData: Omit<Route, "id">): Promise<Route> => {
  try {
    const response = await fetch(ROUTES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(routeData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newRoute: Route = await response.json();
    return newRoute;
  } catch (error) {
    console.error("Failed to create new route:", error);
    throw error;
  }
};

// Updates an existing bus route.
export const updateRoute = async (id: number, routeDetails: Partial<Route>): Promise<Route> => {
  try {
    const response = await fetch(`${ROUTES_API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(routeDetails),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedRoute: Route = await response.json();
    return updatedRoute;
  } catch (error) {
    console.error(`Failed to update route with id ${id}:`, error);
    throw error;
  }
};

// Deletes a bus route by its ID.
export const deleteRoute = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${ROUTES_API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to delete route with id ${id}:`, error);
    throw error;
  }
};
