// src/hooks/search/useBusSearch.ts

import { useState, useEffect, useRef } from "react";
import { searchBuses } from "../../api/busService";
import type { Bus } from "../../types/bus";

/**
 * @interface BusSearchState
 * @description Defines the shape of the data returned by the useBusSearch hook.
 */
interface BusSearchState {
  /** The array of Bus objects returned from the search. */
  busSearchResults: Bus[];
  /** Indicates if a data fetching operation is in progress. */
  loading: boolean;
  /** Stores any error messages that occur during the search. */
  error: string | null;
  /** The current page number being displayed (0-indexed). */
  currentPage: number;
  /** The total number of pages available for the current search. */
  totalPages: number;
  /** The total number of elements that match the search criteria. */
  totalElements: number;
  /** A function to change the current page, triggering a new data fetch. */
  setPage: (page: number) => void;
}

/**
 * @function useBusSearch
 * @description A custom hook to search for buses with pagination and infinite scrolling.
 * It manages fetching, loading, and error states, and handles pagination logic.
 * @param {string} registrationNumber - The search term for the bus registration number.
 * @param {string} serviceType - The filter for the bus service type.
 * @param {number} [initialPage=0] - The starting page number for the search.
 * @param {number} [pageSize=10] - The number of items to fetch per page.
 * @returns {BusSearchState} An object containing the search results, loading state, pagination info, and a function to set the page.
 */
export const useBusSearch = (
  registrationNumber: string,
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

  const isInitialMount = useRef(true);

  /**
   * @function setPage
   * @description Sets the current page number and triggers a new data fetch.
   * @param {number} page - The page number to navigate to.
   */
  const setPage = (page: number) => {
    setState((prevState) => ({ ...prevState, currentPage: page }));
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchBuses = async () => {
      // If a new search term is entered, reset the page and data
      if (!isInitialMount.current && state.currentPage === initialPage) {
        setState((prevState) => ({
          ...prevState,
          busSearchResults: [],
          currentPage: initialPage,
          totalPages: 0,
          totalElements: 0,
        }));
      }

      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      try {
        const response = await searchBuses(
          registrationNumber,
          serviceType,
          state.currentPage,
          pageSize
        );

        if (!signal.aborted) {
          setState((prevState) => {
            // Determine if we should append new data or replace the old data
            const newBusResults =
              state.currentPage === initialPage
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
            busSearchResults: [],
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
  }, [registrationNumber, serviceType, state.currentPage, pageSize]);

  return { ...state, setPage };
};
