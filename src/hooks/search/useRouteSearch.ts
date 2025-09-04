import { useState, useEffect } from "react";
import { searchRoutes } from "../../api/routeService";
import type { Route } from "../../types/route";

// This interface defines the shape of the data that our hook will return.
interface RouteSearchState {
  routeSearchResults: Route[];
  loading: boolean;
  error: string | null;
}

/**
 * A custom hook to search for bus routes using the backend API.
 * It manages the fetching, loading, and error states.
 * @param routeNumber The search term for the route number.
 * @param origin The search term for the origin.
 * @param destination The search term for the destination.
 * @returns An object containing the search results, loading state, and any errors.
 */
export const useRouteSearch = (
  routeNumber?: string,
  origin?: string,
  destination?: string
): RouteSearchState => {
  const [state, setState] = useState<RouteSearchState>({
    routeSearchResults: [],
    loading: false,
    error: null,
  });

  // The useEffect hook handles the data fetching. It runs whenever any of the
  // search parameters (`routeNumber`, `origin`, `destination`) change.
  useEffect(() => {
    // This `AbortController` is a standard practice to cancel previous
    // requests if a new one is initiated, preventing race conditions.
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchRoutes = async () => {
      // Don't perform a search if all fields are empty to avoid unnecessary API calls.
      if (!routeNumber && !origin && !destination) {
        setState({ routeSearchResults: [], loading: false, error: null });
        return;
      }

      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      try {
        const data = await searchRoutes(routeNumber, origin, destination);
        if (!signal.aborted) {
          setState({ routeSearchResults: data, loading: false, error: null });
        }
      } catch (err) {
        if (!signal.aborted) {
          setState({
            routeSearchResults: [],
            loading: false,
            error: err instanceof Error ? err.message : "An unknown error occurred.",
          });
        }
      }
    };

    fetchRoutes();

    // The cleanup function for `useEffect`. It's called when the component unmounts
    // or before the effect runs again, ensuring we don't have lingering requests.
    return () => {
      controller.abort();
    };
  }, [routeNumber, origin, destination]);

  return state;
};
