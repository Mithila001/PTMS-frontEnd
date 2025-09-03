// ptms-frontEnd\src\pages\admin\busManagement\BusManagementPage.tsx

import React, { useEffect, useState } from "react";
import type { Bus } from "../../../types/bus";
import { getBuses } from "../../../api/busService";
import SearchAndFilter from "../../../components/organisms/SearchAndFilter";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import type { Column } from "../../../components/molecules/DataTable";
import DataTable from "../../../components/molecules/DataTable";
import { useApplicationData } from "../../../contexts/ApplicationDataContext";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import { useToast } from "../../../contexts/ToastContext";

const BusManagementPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({ searchTerm: "", selectedFilter: "" });
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);

  const { enums } = useApplicationData();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const data = await getBuses();
        setBuses(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          showToast(`Error: ${e.message}`, "error");
        } else {
          showToast("An unknown error occurred", "error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [showToast]);

  useEffect(() => {
    let newFilteredBuses = buses.filter((bus) => {
      const matchesSearchTerm = bus.registrationNumber
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

      const matchesFilter = !filters.selectedFilter || bus.serviceType === filters.selectedFilter;

      return matchesSearchTerm && matchesFilter;
    });

    setFilteredBuses(newFilteredBuses);
  }, [buses, filters]);

  if (loading) {
    return <LoadingSpinner />;
  }

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
          />
          <PrimaryButton onClick={handleAddBus}>Add Bus</PrimaryButton>
        </div>
      </div>

      <div className="overflow-x-auto">
        <DataTable data={filteredBuses} columns={busColumns} />
      </div>
    </div>
  );
};

export default BusManagementPage;
