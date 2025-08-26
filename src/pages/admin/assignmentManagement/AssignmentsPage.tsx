// src/pages/admin/assignmentManagement/AssignmentsPage.tsx

import React, { useState, useEffect } from "react";
import SearchAndFilter from "../../../components/organisms/SearchAndFilter";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import ErrorAlert from "../../../components/atoms/ErrorAlert";
import DataTable from "../../../components/molecules/DataTable";
import type { Column } from "../../../components/molecules/DataTable";
import type { Assignment, ScheduledTrip } from "../../../types/assignment";
import { getAllAssignments } from "../../../api/assignmentService";
import { getAllScheduledTrips } from "../../../api/scheduledTripService";

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [scheduledTrips, setScheduledTrips] = useState<ScheduledTrip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [filters, setFilters] = useState({ searchTerm: "" });

  // Fetches data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch both assignments and scheduled trips in parallel
        const [assignmentsData, scheduledTripsData] = await Promise.all([
          getAllAssignments(),
          getAllScheduledTrips(),
        ]);
        console.log("Fetched assignments:", assignmentsData);
        console.log("Fetched scheduled trips:", scheduledTripsData);
        setAssignments(assignmentsData);
        setScheduledTrips(scheduledTripsData);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred while fetching data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter assignments based on search term
  useEffect(() => {
    const newFilteredAssignments = assignments.filter((assignment) =>
      assignment.scheduledTrip.route.routeNumber
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase())
    );
    setFilteredAssignments(newFilteredAssignments);
  }, [assignments, filters]);

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

  if (error) {
    return <ErrorAlert errorMessage={error} />;
  }

  // Define the columns for the DataTable
  const columns: Column<Assignment>[] = [
    { header: "ID", key: "id" },
    {
      header: "Route",
      key: "scheduledTrip",
      render: (assignment) => assignment.scheduledTrip?.route.routeNumber || "N/A",
    },
    {
      header: "Bus ID",
      key: "busId",
      render: (assignment) => assignment.busId || "N/A",
    },
    {
      header: "Driver ID",
      key: "driverId",
      render: (assignment) => assignment.driverId || "N/A",
    },
    {
      header: "Conductor ID",
      key: "conductorId",
      render: (assignment) => assignment.conductorId || "N/A",
    },
    { header: "Date", key: "date" },
    { header: "Status", key: "status" },
    {
      header: "Actions",
      key: "actions",
      render: (assignment) => (
        <button
          onClick={() => console.log(`View assignment with ID: ${assignment.id}`)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-6 rounded-full text-xs"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="container mx-auto mt-2 p-2 bg-white">
      {/* Page Header */}
      <div className={commonHeaderStyles}>
        <div>
          <h1 className={titleStyles}>Assignment Management</h1>
          <p className={subtitleStyles}>Manage and view bus assignments</p>
        </div>
        <div className={actionContainerStyles}>
          <SearchAndFilter
            onFilterChange={setFilters}
            filterOptions={[]} // No dropdown filter for now
            filterLabel="Filter By"
          />
          <PrimaryButton onClick={() => console.log("Add new assignment")}>
            Add New Assignment
          </PrimaryButton>
        </div>
      </div>

      {/* Content Table */}
      <div className={contentContainerStyles}>
        <DataTable data={filteredAssignments} columns={columns} />
      </div>
    </div>
  );
};

export default AssignmentsPage;
