import { useState, useEffect } from "react";
import { searchAllEmployees } from "../../api/employeeService";
import type {
  EmployeeSearchResult,
  DriverSearchResult,
  ConductorSearchResult,
} from "../../types/employee";
import { searchDrivers } from "../../api/driverService";
import { searchConductors } from "../../api/conductorService";

// Defines the possible search types for our hook.
export type EmployeeSearchType = "all" | "driver" | "conductor";

// A generic type to handle the different result types from the API.
type EmployeeResults<T> = T extends "driver"
  ? DriverSearchResult[]
  : T extends "conductor"
  ? ConductorSearchResult[]
  : EmployeeSearchResult[];

// Defines the shape of the data that our hook will return.
interface EmployeeSearchState<T extends EmployeeSearchType> {
  employeeSearchResults: EmployeeResults<T> | [];
  loading: boolean;
  error: string | null;
}

/**
 * A custom hook to search for employees, drivers, or conductors using the backend API.
 * It manages the fetching, loading, and error states.
 * @param searchType The type of employee to search for ("all", "driver", or "conductor").
 * @param nicNumber The search term for the NIC number (optional).
 * @param name The search term for the employee's name (optional).
 * @param contactNumber The search term for the contact number (optional).
 * @param licenseNumber The search term for the license number (for drivers/conductors, optional).
 * @returns An object containing the search employeeSearchResults, loading state, and any errors.
 */
export const useEmployeeSearch = <T extends EmployeeSearchType>(
  searchType: T,
  nicNumber?: string,
  name?: string,
  contactNumber?: string,
  licenseNumber?: string
): EmployeeSearchState<T> => {
  const [state, setState] = useState<EmployeeSearchState<T>>({
    employeeSearchResults: [],
    loading: false,
    error: null,
  });

  // A brief explanation of the useEffect hook:
  // It handles the "side effect" of fetching data. The effect runs whenever any of the
  // search parameters change, automatically triggering a new search.
  useEffect(() => {
    // We use an AbortController to cancel a previous request if a new one is started.
    // This prevents a common bug where an outdated response could update the state.
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchEmployees = async () => {
      // Don't search if all fields are empty for the specific search type.
      const hasSearchTerm = nicNumber || name || contactNumber || licenseNumber;

      if (!hasSearchTerm) {
        setState({ employeeSearchResults: [], loading: false, error: null });
        return;
      }

      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      try {
        let data: EmployeeResults<T>;
        switch (searchType) {
          case "driver":
            data = (await searchDrivers(
              nicNumber,
              name,
              contactNumber,
              licenseNumber
            )) as EmployeeResults<T>;
            break;
          case "conductor":
            data = (await searchConductors(
              nicNumber,
              name,
              contactNumber,
              licenseNumber
            )) as EmployeeResults<T>;
            break;
          case "all":
          default:
            data = (await searchAllEmployees(nicNumber, name, contactNumber)) as EmployeeResults<T>;
            break;
        }

        if (!signal.aborted) {
          setState({ employeeSearchResults: data, loading: false, error: null });
        }
      } catch (err) {
        if (!signal.aborted) {
          setState({
            employeeSearchResults: [],
            loading: false,
            error: err instanceof Error ? err.message : "An unknown error occurred.",
          });
        }
      }
    };

    fetchEmployees();

    // The cleanup function for the effect. It's called when the component unmounts
    // or before the effect runs again, ensuring we don't have lingering requests.
    return () => {
      controller.abort();
    };
  }, [searchType, nicNumber, name, contactNumber, licenseNumber]);

  return state;
};
