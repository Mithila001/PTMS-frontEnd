// src/hooks/search/useBusSearch.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { searchBuses } from "../../api/busService";
import type { Bus, PaginatedBusResponse } from "../../types/bus";

interface BusSearchState {
  busSearchResults: Bus[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  setPage: (page: number) => void;
}

export const useBusSearch = (
  searchTerm: string,
  serviceType: string,
  initialPage: number = 0,
  pageSize: number = 10
): BusSearchState => {
  const [state, setState] = useState<Omit<BusSearchState, "setPage">>({
    busSearchResults: [],
    loading: false,
    error: null,
    currentPage: initialPage,
    totalPages: 0,
    totalElements: 0,
  });

  // Track previous search terms to detect changes
  const previousSearchTerms = useRef({ searchTerm, serviceType });

  // Track if we should reset to initial page
  const shouldResetPage = useRef(false);

  // Memoized setPage function
  const setPage = useCallback((page: number) => {
    setState((prevState) => ({ ...prevState, currentPage: page }));
  }, []);

  // Separate effect to handle search term changes and page reset
  useEffect(() => {
    const searchTermsChanged =
      previousSearchTerms.current.searchTerm !== searchTerm ||
      previousSearchTerms.current.serviceType !== serviceType;

    if (searchTermsChanged) {
      shouldResetPage.current = true;
      previousSearchTerms.current = { searchTerm, serviceType };
      setState((prevState) => ({
        ...prevState,
        currentPage: initialPage,
        busSearchResults: [], // Clear results when search terms change
      }));
    }
  }, [searchTerm, serviceType, initialPage]);

  // Main effect for fetching data
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchBuses = async () => {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      const isReset = shouldResetPage.current;
      shouldResetPage.current = false; // Reset the flag

      try {
        const response: PaginatedBusResponse = await searchBuses(
          searchTerm,
          serviceType,
          state.currentPage,
          pageSize
        );

        if (!signal.aborted) {
          setState((prevState) => {
            // If this is a reset (new search terms), replace results
            // Otherwise, append for infinite scrolling
            const newBusResults = isReset
              ? response.data.content
              : [...prevState.busSearchResults, ...response.data.content];

            return {
              ...prevState,
              busSearchResults: newBusResults,
              loading: false,
              totalPages: response.data.totalPages,
              totalElements: response.data.totalElements,
            };
          });
        }
      } catch (err) {
        if (!signal.aborted) {
          setState((prevState) => ({
            ...prevState,
            loading: false,
            error: err instanceof Error ? err.message : "An unknown error occurred.",
          }));
        }
      }
    };

    fetchBuses();

    return () => {
      controller.abort();
    };
  }, [searchTerm, serviceType, state.currentPage, pageSize]); // Removed initialPage from deps

  return { ...state, setPage };
};
