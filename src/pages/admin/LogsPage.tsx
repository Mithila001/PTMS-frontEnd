// src/pages/admin/LogsPage.tsx
import React, { useEffect, useState } from "react";
import SearchAndFilter from "../../components/organisms/SearchAndFilter";
import DataTable, { type Column } from "../../components/molecules/DataTable";
import { getAllLogs } from "../../api/logService";
import { formatLogsForDisplay } from "../../utils/logFormatter";
import type { DisplayLog } from "../../types/logs";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import { useToast } from "../../contexts/ToastContext";

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<DisplayLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({ searchTerm: "", selectedFilter: "" });
  const [filteredLogs, setFilteredLogs] = useState<DisplayLog[]>([]);
  const { showToast } = useToast();

  // Fetches all logs from the backend API when the component mounts.
  useEffect(() => {
    const fetchAndFormatLogs = async () => {
      try {
        const rawLogs = await getAllLogs();
        const formattedLogs = formatLogsForDisplay(rawLogs);
        setLogs(formattedLogs);
      } catch (e: unknown) {
        if (e instanceof Error) {
          showToast(e.message, "error");
        } else {
          showToast("An unknown error occurred while fetching logs.", "error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAndFormatLogs();
  }, [showToast]);

  // Filters the logs based on the search term and selected filter.
  useEffect(() => {
    let newFilteredLogs = logs.filter((log) => {
      const matchesSearchTerm =
        log.username.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        log.entityType.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesFilter =
        filters.selectedFilter === "" || log.actionType === filters.selectedFilter;

      return matchesSearchTerm && matchesFilter;
    });

    setFilteredLogs(newFilteredLogs);
  }, [logs, filters]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // The ErrorAlert component is no longer needed here.
  // The ToastContext will handle displaying the error.

  const logColumns: Column<DisplayLog>[] = [
    { header: "Date", key: "date" },
    { header: "Time", key: "time" },
    { header: "Username", key: "username" },
    { header: "Action", key: "actionType" },
    { header: "Entity", key: "entityType" },
    {
      header: "Entity ID",
      key: "entityId",
      render: (log) => (log.entityId ? log.entityId.toString() : "N/A"),
    },
    { header: "Details", key: "details" },
  ];

  return (
    <div className="container mx-auto mt-2 p-2 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-2 bg-white border rounded-lg shadow-sm mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">System Logs</h1>
          <p className="text-gray-600 mt-1">View and filter system-wide logs</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <SearchAndFilter
            onFilterChange={setFilters}
            filterOptions={[]}
            filterLabel="Filter By"
            searchTerm={""}
            selectedFilter={""}
          />
        </div>
      </div>
      <DataTable data={filteredLogs} columns={logColumns} columnsWithLineBreaks={["details"]} />
    </div>
  );
};

export default LogsPage;
