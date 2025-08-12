import React, { useEffect, useState } from "react";
import type { Bus } from "../../types/bus";
import { getBuses } from "../../api/busService";
import SearchAndFilter from "../../components/organisms/SearchAndFilter";
import PrimaryButton from "../../components/atoms/PrimaryButton";

const BusManagementPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ searchTerm: "", selectedFilter: "" });
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const data = await getBuses();
        setBuses(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  useEffect(() => {
    let newFilteredBuses = buses.filter((bus) => {
      const matchesSearchTerm = bus.registrationNumber
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

      const matchesFilter = !filters.selectedFilter || bus.fuelType === filters.selectedFilter;

      return matchesSearchTerm && matchesFilter;
    });

    setFilteredBuses(newFilteredBuses);
  }, [buses, filters]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleViewBus = (busId: number) => {
    window.location.href = `/admin/buses/${busId}`;
  };

  // Get unique fuel types for the dropdown filter
  const fuelTypes = Array.from(new Set(buses.map((bus) => bus.fuelType)));

  // Define styles for table headers and cells
  const thStyles =
    "px-5 py-5 border-b-2 border-gray-500 text-left text-xs font-bold text-gray-700 uppercase tracking-wider";
  const tdStyles = "px-5 py-2 border-b border-gray-200 text-sm";

  const handleAddBus = (): void => {
    window.location.href = "/admin/buses/addBus";
  };

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
            filterOptions={fuelTypes}
            filterLabel="Filter By"
          />
          <PrimaryButton onClick={handleAddBus}>Add Bus</PrimaryButton>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-100">
            <tr>
              <th className={thStyles}>ID</th>
              <th className={thStyles}>Reg No.</th>
              <th className={thStyles}>Make</th>
              <th className={thStyles}>Model</th>
              <th className={thStyles}>Year</th>
              <th className={thStyles}>Fuel Type</th>
              <th className={thStyles}>Seating Capacity</th>
              <th className={thStyles}>NTC Permit Number</th>
              <th className={thStyles}>Bus Type</th>
              <th className={thStyles}>Active</th>
              <th className={thStyles}>A/C</th>
              <th className={thStyles}></th>
            </tr>
          </thead>
          <tbody>
            {filteredBuses.map((bus, index) => (
              <tr
                key={bus.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition duration-200 ease-in-out`}
              >
                <td className={tdStyles}>{bus.id}</td>
                <td className={tdStyles}>{bus.registrationNumber}</td>
                <td className={tdStyles}>{bus.make}</td>
                <td className={tdStyles}>{bus.model}</td>
                <td className={tdStyles}>{bus.yearOfManufacture}</td>
                <td className={tdStyles}>{bus.fuelType}</td>
                <td className={tdStyles}>{bus.seatingCapacity}</td>
                <td className={tdStyles}>{bus.ntcPermitNumber}</td>
                <td className={tdStyles}>{bus.busType}</td>
                <td className={tdStyles}>{bus.active ? "Yes" : "No"}</td>
                <td className={tdStyles}>{bus.a_C ? "Yes" : "No"}</td>
                <td className={tdStyles}>
                  <button
                    onClick={() => handleViewBus(bus.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-6 rounded-full text-xs"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusManagementPage;
