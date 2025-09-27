// src/pages/admin/assignmentManagement/AssignmentsPage.tsx

import React, { useState, useEffect } from "react";
import SearchAndFilter from "../../../components/organisms/SearchAndFilter";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import DataTable from "../../../components/molecules/DataTable";
import type { Column } from "../../../components/molecules/DataTable";
import type { Assignment } from "../../../types/assignment";
import { getAllAssignments } from "../../../api/assignmentService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [filters, setFilters] = useState({ searchTerm: "" });
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Fetches data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const assignmentsData = await getAllAssignments();
        console.log("Fetched assignments:", assignmentsData);
        setAssignments(assignmentsData);
      } catch (e: unknown) {
        if (e instanceof Error) {
          showToast(e.message, "error");
        } else {
          showToast("An unknown error occurred while fetching data.", "error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  // Filter assignments based on search term
  useEffect(() => {
    const newFilteredAssignments = assignments.filter(
      (assignment) =>
        assignment.date?.toString().toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        false
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

  // Columns for the DataTable
  const columns: Column<Assignment>[] = [
    { header: "ID", key: "id" },
    {
      header: "Date",
      key: "date",
      render: (assignment) => (assignment.date ? assignment.date.toString() : "N/A"),
    },
    {
      header: "Bus",
      key: "busRegistrationNumber",
      render: (assignment) => assignment.busRegistrationNumber || "N/A",
    },
    {
      header: "Driver",
      key: "driverName",
      render: (assignment) => assignment.driverName || "N/A",
    },
    {
      header: "Conductor",
      key: "conductorName",
      render: (assignment) => assignment.conductorName || "N/A",
    },
    { header: "Status", key: "status" },
    {
      header: "Actions",
      key: "actions",
      render: (assignment) => (
        <button
          onClick={() => navigate(`/admin/assignments/moreInfo/${assignment.id}`)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-6 rounded-full text-xs"
        >
          View
        </button>
      ),
    },
  ];

  function handleAddNewAssignment(): void {
    navigate("/admin/assignments/addAssignment");
  }

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
            showSearchResults={false}
            searchInputPlaceholder="By Date"
            showDropdownFilter={false}
            searchTerm={filters.searchTerm}
            selectedFilter=""
          />
          <PrimaryButton onClick={() => handleAddNewAssignment()}>Add New Assignment</PrimaryButton>
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
