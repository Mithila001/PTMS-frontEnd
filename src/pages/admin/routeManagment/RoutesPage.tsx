// src/pages/admin/routeManagment/RoutesPage.tsx

import React, { useEffect, useState } from "react";
import type { Route } from "../../../types/route";
import { getAllRoutes } from "../../../api/routeService";
import SearchAndFilter from "../../../components/organisms/SearchAndFilter";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import type { Column } from "../../../components/molecules/DataTable";
import DataTable from "../../../components/molecules/DataTable";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import { useToast } from "../../../contexts/ToastContext";

const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({ searchTerm: "", selectedFilter: "" });
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);

  const { showToast } = useToast();

  // Fetch all routes from the backend API when the component mounts.
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await getAllRoutes();
        setRoutes(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          showToast(`Error fetching routes: ${e.message}`, "error");
        } else {
          showToast("An unknown error occurred while fetching routes", "error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  // Filter the routes based on the search term.
  useEffect(() => {
    let newFilteredRoutes = routes.filter((route) => {
      const matchesSearchTerm = route.routeNumber
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

      // For now, there are no filter options, so this part is simplified.
      const matchesFilter = true;

      return matchesSearchTerm && matchesFilter;
    });

    setFilteredRoutes(newFilteredRoutes);
  }, [routes, filters]);

  const handleViewRoute = (routeId: number) => {
    window.location.href = `/admin/routes/${routeId}`;
  };

  const handleAddRoute = (): void => {
    window.location.href = "/admin/routes/addRoutes";
  };

  const routeColumns: Column<Route>[] = [
    { header: "ID", key: "id" },
    { header: "Route Number", key: "routeNumber" },
    { header: "Origin", key: "origin" },
    { header: "Destination", key: "destination" },
    {
      header: "Major Stops",
      key: "majorStops",
      render: (route) =>
        route.majorStops && route.majorStops.length > 0 ? (
          <ul className="list-disc list-inside">
            {route.majorStops.map((stop, index) => (
              <li key={index}>{stop}</li>
            ))}
          </ul>
        ) : (
          "N/A"
        ),
    },
    {
      header: "", // Empty header for the action column
      key: "actions",
      render: (route) => (
        <button
          onClick={() => handleViewRoute(route.id)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-6 rounded-full text-xs"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="container mx-auto mt-2 p-2 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-2 bg-white border rounded-lg shadow-sm mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Route Management</h1>
          <p className="text-gray-600 mt-1">Manage and view bus routes</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <SearchAndFilter
            onFilterChange={setFilters}
            filterOptions={[]} // No dropdown filter for now
            filterLabel="Filter By"
          />
          <PrimaryButton onClick={handleAddRoute}>Add Route</PrimaryButton>
        </div>
      </div>
      {loading ? <LoadingSpinner /> : <DataTable data={filteredRoutes} columns={routeColumns} />}
    </div>
  );
};

export default RoutesPage;
