// ptms-frontEnd\src\hooks\search\useScheduledTripSearch.ts

import { useState, useEffect } from "react";
import { searchScheduledTrips } from "../../api/scheduledTripService";
import type { ScheduledTrip, TripDirection } from "../../types/assignment";

// Defines the shape of the data that our hook will return.
interface ScheduledTripSearchState {
  scheduledTripSearchResults: ScheduledTrip[];
  loading: boolean;
  error: string | null;
}

/**
 * A custom hook to search for scheduled trips using the backend API.
 * It manages the fetching, loading, and error states.
 * @param scheduledTripRouteNumber The route number to search for (optional).
 * @param direction The trip direction to search for ("UP" or "DOWN") (optional).
 * @returns An object containing the search results, loading state, and any errors.
 */
export const useScheduledTripSearch = (
  scheduledTripRouteNumber?: string,
  direction?: TripDirection
): ScheduledTripSearchState => {
  const [state, setState] = useState<ScheduledTripSearchState>({
    scheduledTripSearchResults: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    // We use an AbortController to cancel a previous request if a new one is started.
    // This prevents a common bug where an outdated response could update the state.
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchScheduledTrips = async () => {
      // Only perform a search if at least one parameter is provided.
      const hasSearchTerm = scheduledTripRouteNumber || direction;
      if (!hasSearchTerm) {
        setState({ scheduledTripSearchResults: [], loading: false, error: null });
        return;
      }

      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      try {
        const data = await searchScheduledTrips(scheduledTripRouteNumber, direction);

        if (!signal.aborted) {
          setState({ scheduledTripSearchResults: data, loading: false, error: null });
        }
      } catch (err) {
        if (!signal.aborted) {
          setState({
            scheduledTripSearchResults: [],
            loading: false,
            error: err instanceof Error ? err.message : "An unknown error occurred.",
          });
        }
      }
    };

    fetchScheduledTrips();

    // The cleanup function for the effect. It's called when the component unmounts
    // or before the effect runs again, ensuring we don't have lingering requests.
    return () => {
      controller.abort();
    };
  }, [scheduledTripRouteNumber, direction]);

  //console.log("Scheduled Trip Search State:", state); // Debugging log
  return state;
};
