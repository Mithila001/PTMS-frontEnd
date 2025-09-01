import { useState, useEffect } from "react";
import { searchBuses } from "../../api/busService";
import type { Bus } from "../../types/bus";

// Defines the shape of the data that our hook will return.
interface BusSearchState {
  busSearchResults: Bus[];
  loading: boolean;
  error: string | null;
}

/**
 * A custom hook to search for buses using the backend API.
 * It manages the fetching, loading, and error states.
 * @param registrationNumber The search term for the bus registration number.
 * @param serviceType The filter for the bus service type.
 * @returns An object containing the search busSearchResults, loading state, and any errors.
 */
export const useBusSearch = (registrationNumber: string, serviceType: string): BusSearchState => {
  const [state, setState] = useState<BusSearchState>({
    busSearchResults: [],
    loading: false,
    error: null,
  });

  // A brief explanation of the useEffect hook:
  // It handles the "side effect" of fetching data. The effect runs whenever the
  // `registrationNumber` or `serviceType` changes, automatically triggering a new search.
  useEffect(() => {
    // We use an AbortController to cancel a previous request if a new one is started.
    // This prevents a common bug where an outdated response could update the state.
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchBuses = async () => {
      // Don't search if both fields are empty.
      if (!registrationNumber && !serviceType) {
        setState({ busSearchResults: [], loading: false, error: null });
        return;
      }

      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      try {
        const data = await searchBuses(registrationNumber, serviceType);
        if (!signal.aborted) {
          setState({ busSearchResults: data, loading: false, error: null });
        }
      } catch (err) {
        if (!signal.aborted) {
          setState({
            busSearchResults: [],
            loading: false,
            error: err instanceof Error ? err.message : "An unknown error occurred.",
          });
        }
      }
    };

    fetchBuses();

    // The cleanup function for the effect. It's called when the component unmounts
    // or before the effect runs again, ensuring we don't have lingering requests.
    return () => {
      controller.abort();
    };
  }, [registrationNumber, serviceType]);

  return state;
};
