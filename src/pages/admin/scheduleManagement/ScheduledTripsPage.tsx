// src/pages/admin/assignmentManagement/ScheduledTripsPage.tsx

import React, { useState, useEffect } from "react";
import SearchAndFilter from "../../../components/organisms/SearchAndFilter";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import DataTable from "../../../components/molecules/DataTable";
import type { Column } from "../../../components/molecules/DataTable";
import type { ScheduledTrip } from "../../../types/assignment";
import { getAllScheduledTrips } from "../../../api/scheduledTripService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";

const ScheduledTripsPage: React.FC = () => {
  const [scheduledTrips, setScheduledTrips] = useState<ScheduledTrip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredScheduledTrips, setFilteredScheduledTrips] = useState<ScheduledTrip[]>([]);
  const [filters, setFilters] = useState({ searchTerm: "" });
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Fetches data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const scheduledTripsData = await getAllScheduledTrips();
        console.log("Fetched scheduled trips:", scheduledTripsData);
        setScheduledTrips(scheduledTripsData);
      } catch (e: unknown) {
        if (e instanceof Error) {
          showToast(e.message, "error");
        } else {
          showToast("An unknown error occurred while fetching scheduled trips.", "error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  // Filter scheduled trips based on search term
  useEffect(() => {
    const newFilteredTrips = scheduledTrips.filter((trip) =>
      trip.route.routeNumber.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );
    setFilteredScheduledTrips(newFilteredTrips);
  }, [scheduledTrips, filters]);

  // UI styles from the example
  const commonHeaderStyles =
    "flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-2 bg-white border rounded-lg shadow-sm mb-6";
  const titleStyles = "text-3xl font-bold text-gray-800";
  const subtitleStyles = "text-gray-600 mt-1";
  const actionContainerStyles = "flex flex-col sm:flex-row items-stretch sm:items-center gap-3";
  const contentContainerStyles = "bg-white p-4 rounded-lg shadow-sm border";

  if (loading) {
    return <LoadingSpinner />;
  }

  // Define the columns for the DataTable
  const columns: Column<ScheduledTrip>[] = [
    { header: "Trip ID", key: "id" },
    {
      header: "Route",
      key: "route",
      render: (trip) => trip.route?.routeNumber || "N/A",
    },
    {
      header: "Origin",
      key: "route",
      render: (trip) => trip.route?.origin || "N/A",
    },
    {
      header: "Destination",
      key: "route",
      render: (trip) => trip.route?.destination || "N/A",
    },
    {
      header: "Start Time",
      key: "expectedStartTime",
      render: (trip) => (trip.expectedStartTime ? trip.expectedStartTime.toString() : "N/A"),
    },
    {
      header: "End Time",
      key: "expectedEndTime",
      render: (trip) => (trip.expectedEndTime ? trip.expectedEndTime.toString() : "N/A"),
    },
    {
      header: "Actions",
      key: "actions",
      render: (trip) => (
        <button
          onClick={() => navigate(`/admin/scheduledtrips/moreInfo/${trip.id}`)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-6 rounded-full text-xs"
        >
          View
        </button>
      ),
    },
  ];

  function handleAddScheduledTrip(): void {
    navigate("/admin/scheduledTrips/addScheduledTrip");
  }

  return (
    <div className="container mx-auto mt-2 p-2 bg-white">
      {/* Page Header */}
      <div className={commonHeaderStyles}>
        <div>
          <h1 className={titleStyles}>Scheduled Trip Management</h1>
          <p className={subtitleStyles}>Manage and view scheduled bus trips</p>
        </div>
        <div className={actionContainerStyles}>
          <SearchAndFilter
            searchTerm={filters.searchTerm}
            selectedFilter=""
            onFilterChange={setFilters}
            filterOptions={[]} // No dropdown filter for now
            filterLabel="Filter By"
            showSearchResults={false}
            searchInputPlaceholder="By Route Number"
            showDropdownFilter={false}
          />
          <PrimaryButton onClick={handleAddScheduledTrip}>Add Scheduled Trip</PrimaryButton>
        </div>
      </div>

      {/* Content Table */}
      <div className={contentContainerStyles}>
        <DataTable data={filteredScheduledTrips} columns={columns} />
      </div>
    </div>
  );
};

export default ScheduledTripsPage;
