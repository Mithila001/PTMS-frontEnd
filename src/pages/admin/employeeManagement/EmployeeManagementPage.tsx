import React, { useState, useEffect } from "react";
import SearchAndFilter from "../../../components/organisms/SearchAndFilter";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import EmployeeTable from "../../../components/molecules/EmployeeTable";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import ErrorAlert from "../../../components/atoms/ErrorAlert";
import type { Conductor, Driver } from "../../../types/employee";
import { getAllDrivers, getAllConductors } from "../../../api/employeeService";

const EmployeeManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"drivers" | "conductors">("drivers");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [conductors, setConductors] = useState<Conductor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [driversData, conductorsData] = await Promise.all([
          getAllDrivers(),
          getAllConductors(),
        ]);
        setDrivers(driversData);
        setConductors(conductorsData);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred while fetching employees");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddEmployee = () => {
    // Navigate to the add employee form page
    console.log(`Add new ${activeTab} employee`);
  };

  const handleViewDetails = (id: number) => {
    // Navigate to the details page
    console.log(`Viewing details for employee with ID: ${id}`);
  };

  const commonHeaderStyles =
    "flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-2 bg-white border rounded-lg shadow-sm mb-6";
  const titleStyles = "text-3xl font-bold text-gray-800";
  const subtitleStyles = "text-gray-600 mt-1";
  const actionContainerStyles = "flex flex-col sm:flex-row items-stretch sm:items-center gap-3";
  const tabsContainerStyles = "flex border-b border-gray-200 mb-4 overflow-x-auto";
  const tabButtonBaseStyles =
    "whitespace-nowrap py-2 px-4 font-semibold text-gray-600 hover:text-gray-900 focus:outline-none transition-colors duration-200";
  const tabButtonActiveStyles = "border-b-2 border-blue-500 text-blue-600";
  const tabButtonInactiveStyles = "border-b-2 border-transparent";
  const contentContainerStyles = "bg-white p-4 rounded-lg shadow-sm border";

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert errorMessage={error} />;
  }

  return (
    <div className="container mx-auto mt-2 p-2">
      {/* Page Header */}
      <div className={commonHeaderStyles}>
        <div>
          <h1 className={titleStyles}>Employee Management</h1>
          <p className={subtitleStyles}>Manage and view employee data</p>
        </div>
        <div className={actionContainerStyles}>
          <SearchAndFilter
            onFilterChange={(filters) => console.log(filters)}
            filterOptions={[]} // No dropdown filter for now
            filterLabel="Filter By"
          />
          <PrimaryButton onClick={handleAddEmployee}>Add Employee</PrimaryButton>
        </div>
      </div>

      {/* Tabs */}
      <div className={tabsContainerStyles}>
        <button
          onClick={() => setActiveTab("drivers")}
          className={`${tabButtonBaseStyles} ${
            activeTab === "drivers" ? tabButtonActiveStyles : tabButtonInactiveStyles
          }`}
        >
          Drivers
        </button>
        <button
          onClick={() => setActiveTab("conductors")}
          className={`${tabButtonBaseStyles} ${
            activeTab === "conductors" ? tabButtonActiveStyles : tabButtonInactiveStyles
          }`}
        >
          Conductors
        </button>
      </div>

      {/* Tab Content */}
      <div className={contentContainerStyles}>
        {activeTab === "drivers" && (
          <EmployeeTable employees={drivers} onViewDetails={handleViewDetails} />
        )}
        {activeTab === "conductors" && (
          <EmployeeTable employees={conductors} onViewDetails={handleViewDetails} />
        )}
      </div>
    </div>
  );
};

export default EmployeeManagementPage;
