import React, { useEffect, useState, useRef } from "react";
import type { Bus } from "../../../types/bus";
import SearchAndFilter from "../../../components/organisms/SearchAndFilter";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import type { Column } from "../../../components/molecules/DataTable";
import DataTable from "../../../components/molecules/DataTable";
import { useApplicationData } from "../../../contexts/ApplicationDataContext";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import { useToast } from "../../../contexts/ToastContext";
import { useBusData } from "../../../hooks/data/useBusData";

const BusManagementPage: React.FC = () => {
  const [filters, setFilters] = useState({ searchTerm: "", selectedFilter: "" });
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
  const { enums } = useApplicationData();
  // const { highestRole, user } = useAuth();
  const { showToast } = useToast();

  const {
    busSearchResults: buses,
    loading,
    error,
    currentPage,
    totalPages,
    setPage,
  } = useBusData(filters.searchTerm, filters.selectedFilter);

  const observerTarget = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track when initial data has loaded
  useEffect(() => {
    // showToast(`Logged in as: ${user?.roles}`, "info");
    if (!loading && buses.length > 0 && !hasLoadedInitialData) {
      setHasLoadedInitialData(true);
    }
  }, [loading, buses.length, hasLoadedInitialData]);

  // Handle intersection observer for infinite scrolling
  useEffect(() => {
    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Don't set up observer if we're on the last page or still loading initial data
    if (currentPage >= totalPages - 1 || totalPages === 0) {
      return;
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage(currentPage + 1);
        }
      },
      {
        rootMargin: "0px 0px 100px 0px",
      }
    );

    // Start observing
    if (observerTarget.current && observerRef.current) {
      observerRef.current.observe(observerTarget.current);
    }

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [currentPage, totalPages, setPage, loading]);

  // Handle errors
  useEffect(() => {
    if (error) {
      showToast(`Error: ${error}`, "error");
    }
  }, [error, showToast]);

  const handleViewBus = (busId: number) => {
    window.location.href = `/admin/buses/${busId}`;
  };

  const handleAddBus = (): void => {
    window.location.href = "/admin/buses/addBus";
  };

  const busColumns: Column<Bus>[] = [
    { header: "ID", key: "id" },
    { header: "Reg No.", key: "registrationNumber" },
    { header: "Make", key: "make" },
    { header: "Model", key: "model" },
    { header: "Year", key: "yearOfManufacture" },
    { header: "Fuel Type", key: "fuelType" },
    { header: "Seating Capacity", key: "seatingCapacity" },
    { header: "NTC Permit Number", key: "ntcPermitNumber" },
    { header: "Bus Type", key: "serviceType" },
    { header: "Comfort Type", key: "comfortType" },
    { header: "Active", key: "active", render: (bus) => (bus.active ? "Yes" : "No") },
    { header: "A/C", key: "isA_C", render: (bus) => (bus.isA_C ? "Yes" : "No") },
    {
      header: "",
      key: "actions",
      render: (bus) => (
        <button
          onClick={() => handleViewBus(bus.id)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-6 rounded-full text-xs"
        >
          View
        </button>
      ),
    },
  ];

  // Show full page loading spinner for initial load
  if (!hasLoadedInitialData && loading) {
    return (
      <div className="container mx-auto mt-2 p-2 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-2 bg-white border rounded-lg shadow-sm mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bus Data</h1>
            <p className="text-gray-600 mt-1">Manage your fleet information</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <SearchAndFilter
              searchTerm={filters.searchTerm}
              selectedFilter={filters.selectedFilter}
              onFilterChange={setFilters}
              filterOptions={enums.serviceType}
              filterLabel="Filter By"
              showSearchResults={false}
              searchInputPlaceholder="By Registration number"
            />
            <PrimaryButton onClick={handleAddBus}>Add Bus</PrimaryButton>
          </div>
        </div>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-2 p-2 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-2 bg-white border rounded-lg shadow-sm mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bus Data</h1>
          <p className="text-gray-600 mt-1">Manage your fleet information</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <SearchAndFilter
            searchTerm={filters.searchTerm}
            selectedFilter={filters.selectedFilter}
            onFilterChange={setFilters}
            filterOptions={enums.serviceType}
            filterLabel="Filter By"
            showSearchResults={false}
            searchInputPlaceholder="By Registration number"
          />
          <PrimaryButton onClick={handleAddBus}>Add Bus</PrimaryButton>
        </div>
      </div>

      <div className="overflow-x-auto">
        {buses.length === 0 && !loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500 text-lg">No buses found</p>
          </div>
        ) : (
          <>
            <DataTable
              data={buses}
              columns={busColumns}
              isLoading={loading && hasLoadedInitialData}
            />
            {/* Observer target for infinite scrolling */}
            {currentPage < totalPages - 1 && <div ref={observerTarget} className="h-1" />}
          </>
        )}
      </div>
    </div>
  );
};

export default BusManagementPage;
