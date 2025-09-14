// F:\OnGoinProject\Transport Management System\ptms-frontEnd\src\pages\admin\busManagement\BusManagementPage.tsx

import React, { useEffect, useState, useRef } from "react";
import type { Bus } from "../../../types/bus";
import SearchAndFilter from "../../../components/organisms/SearchAndFilter";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import type { Column } from "../../../components/molecules/DataTable";
import DataTable from "../../../components/molecules/DataTable";
import { useApplicationData } from "../../../contexts/ApplicationDataContext";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import { useToast } from "../../../contexts/ToastContext";
import { useBusSearch } from "../../../hooks/search/useBusSearch";

// A brief explanation of this new component:
// This is a small, inline spinner component that is less intrusive than the main LoadingSpinner.
// We'll use this for infinite scrolling.
const InlineLoadingSpinner: React.FC = () => (
  <div className="flex justify-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const BusManagementPage: React.FC = () => {
  const [filters, setFilters] = useState({ searchTerm: "", selectedFilter: "" });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { enums } = useApplicationData();
  const { showToast } = useToast();

  const {
    busSearchResults: buses,
    loading,
    error,
    currentPage,
    totalPages,
    setPage,
  } = useBusSearch(filters.searchTerm, filters.selectedFilter);

  const observerTarget = useRef(null);

  // A brief explanation of the combined useEffect logic:
  // This useEffect now manages two separate behaviors based on the `loading` state.
  // When the component is loading for the first time, it sets `isInitialLoad` to false.
  // When loading more records (not initial load), it handles the Intersection Observer logic.
  useEffect(() => {
    if (loading && buses.length === 0) {
      // This is the initial load, so we show the full-page spinner.
      setIsInitialLoad(true);
      return;
    } else if (loading && buses.length > 0) {
      // This is a subsequent load for more records, so we don't show the full-page spinner.
      setIsInitialLoad(false);
    } else if (!loading) {
      setIsInitialLoad(false);
    }

    // Don't observe if we are on the last page.
    if (currentPage >= totalPages - 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage(currentPage + 1);
        }
      },
      {
        rootMargin: "0px 0px 100px 0px",
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, currentPage, totalPages, setPage, buses.length]);

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

  // A brief explanation of the conditional rendering:
  // We first check for the initial load. If it's the first time and we're loading,
  // we show the full-page spinner. Otherwise, we show the main content.
  if (isInitialLoad && loading) {
    return <LoadingSpinner />;
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
        <DataTable data={buses} columns={busColumns} />
        {/*
          A brief explanation of the new loading indicator:
          This part now checks if a new page is being loaded and if it's not the initial load.
          If so, it displays the smaller `InlineLoadingSpinner`.
        */}
        {loading && !isInitialLoad && <InlineLoadingSpinner />}
        {/*
          A brief explanation of the sentinel element:
          We conditionally render the sentinel only if there are more pages to load.
          This prevents the Intersection Observer from running unnecessarily when we're at the end.
        */}
        {currentPage < totalPages - 1 && <div ref={observerTarget}></div>}
      </div>
    </div>
  );
};

export default BusManagementPage;
