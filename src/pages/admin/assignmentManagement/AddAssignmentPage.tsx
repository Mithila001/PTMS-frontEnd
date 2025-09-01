// src/pages/admin/assignmentManagement/AddAssignmentPage.tsx

import React, { useRef, useState } from "react";
import { createAssignment } from "../../../api/assignmentService";
import type { Assignment } from "../../../types/assignment";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import ErrorAlert from "../../../components/atoms/ErrorAlert";
import TextInput from "../../../components/atoms/TextInput";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/atoms/SearchBar";
import { useBusSearch } from "../../../hooks/search/useBusSearch";
import SearchInputForm from "../../../components/molecules/SearchInputForm";
import { useEmployeeSearch } from "../../../hooks/search/useEmployeeSearch";
import { useScheduledTripSearch } from "../../../hooks/search/useScheduledTripSearch";
import type { Route } from "../../../types/route";

// Define an initial state for a new assignment based on the new interface
// We'll use a type that aligns with the 'createAssignment' API call
type NewAssignmentData = Omit<Assignment, "id" | "scheduledTrip"> & {
  scheduledTripId: number;
};

const emptyAssignment: NewAssignmentData = {
  scheduledTripId: 0,
  busId: 0,
  driverId: 0,
  conductorId: 0,
  date: "",
  actualStartTime: null,
  actualEndTime: null,
  status: "IN_PROGRESS", // You may want to set a default status
  driverName: "",
  conductorName: "",
  busRegistrationNumber: "",
};

const AddAssignmentPage: React.FC = () => {
  const [assignment, setAssignment] = useState<NewAssignmentData>(emptyAssignment);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewOnlyBusType, setViewOnlyBusType] = useState<string>("");
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const selectedFilter = useRef<string>("");

  const { busSearchResults } = useBusSearch(searchTerm, selectedFilter.current);
  const busSearchResultsFiltered = busSearchResults.map((bus) => bus.registrationNumber);

  // Driver Search
  const [viewOnlyDriverNic, setViewOnlyDriverNic] = useState<string>("");
  const [driverName, setDriverName] = useState("");
  const { employeeSearchResults: driverSearchResults } = useEmployeeSearch(
    "driver",
    undefined,
    driverName,
    undefined,
    undefined
  );
  const driverSearchResultsFiltered = driverSearchResults.map(
    (driver) => driver.firstName + " " + driver.lastName
  );

  // Conductor Search
  const [conductorViewOnlyNic, setConductorViewOnlyNic] = useState<string>("");
  const [conductorName, setConductorName] = useState("");
  const { employeeSearchResults: conductorSearchResults } = useEmployeeSearch(
    "conductor",
    undefined,
    conductorName,
    undefined,
    undefined
  );
  const conductorSearchResultsFiltered = conductorSearchResults.map(
    (conductor) => conductor.firstName + " " + conductor.lastName
  );

  // Scheduled Trip Search
  const [scheduledTripViewOnlyRoute, setScheduledTripViewOnlyRoute] = useState<Route | null>(null);
  const [scheduledTripRouteNumber, setScheduledTripRouteNumber] = useState<string>("");
  const { scheduledTripSearchResults } = useScheduledTripSearch(scheduledTripRouteNumber);

  const scheduledTripSearchResultsFiltered = scheduledTripSearchResults.map(
    (trip) => `${trip.route.routeNumber}`
  );

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      // Validate that all required IDs are provided and are valid numbers
      if (
        !assignment.scheduledTripId ||
        !assignment.busId ||
        !assignment.driverId ||
        !assignment.conductorId
      ) {
        setError("All IDs (Scheduled Trip, Bus, Driver, Conductor) are required.");
        setLoading(false);
        return;
      }

      await createAssignment(assignment);
      console.log("Assignment created successfully.");
      alert("Assignment created successfully! 👍");
      setAssignment(emptyAssignment); // Reset form after successful submission
      navigate("/admin/assignments"); // Redirect to the assignments list page
    } catch (error) {
      console.error("Failed to save assignment details:", error);
      setError("Failed to create assignment. Please try again. 😢");
    } finally {
      setLoading(false);
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAssignment((prevAssignment) => {
      // Check if the input ID should be a number
      const isNumberField = ["scheduledTripId", "busId", "driverId", "conductorId"].includes(id);
      const newValue = isNumberField ? parseInt(value) || 0 : value;
      return {
        ...prevAssignment,
        [id]: newValue,
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  function handleBusSearchChanges(value: string): void {
    const selectedBus = busSearchResults.find((bus) => bus.registrationNumber === value);

    if (selectedBus) {
      // Update the busId and busRegistrationNumber in the assignment state
      setAssignment((prevAssignment) => ({
        ...prevAssignment,
        busId: selectedBus.id,
        busRegistrationNumber: selectedBus.registrationNumber,
      }));

      // Set the bus type to the state for the read-only input
      setViewOnlyBusType(selectedBus.serviceType);
    }
    // Implement your search logic here
    setSearchTerm(value);
    //console.log("Search term changed:", value);
  }

  const handleDriverSearchChanges = (value: string): void => {
    setDriverName(value);
    const selectedDriver = driverSearchResults.find(
      (driver) => driver.firstName + " " + driver.lastName === value
    );

    if (selectedDriver) {
      setAssignment((prevAssignment) => ({
        ...prevAssignment,
        driverId: selectedDriver.id,
        driverName: selectedDriver.firstName + " " + selectedDriver.lastName,
      }));

      setViewOnlyDriverNic(selectedDriver?.nicNumber);
    }

    setDriverName(value);
  };

  const handleConductorSearchChanges = (value: string): void => {
    setConductorName(value);
    const selectedConductor = conductorSearchResults.find(
      (conductor) => conductor.firstName + " " + conductor.lastName === value
    );

    if (selectedConductor) {
      setAssignment((prevAssignment) => ({
        ...prevAssignment,
        conductorId: selectedConductor.id,
        conductorName: selectedConductor.firstName + " " + selectedConductor.lastName,
      }));

      setConductorViewOnlyNic(selectedConductor?.nicNumber);
    }

    setConductorName(value);
  };

  const handleScheduledTripSearch = (value: string): void => {
    setScheduledTripRouteNumber(value);
    const selectedTrip = scheduledTripSearchResults.find(
      (trip) => `${trip.route.routeNumber}` === value
    );

    if (selectedTrip) {
      setAssignment((prevAssignment) => ({
        ...prevAssignment,
        scheduledTripId: selectedTrip.id,
      }));

      setScheduledTripViewOnlyRoute(selectedTrip.route);
    }

    setScheduledTripRouteNumber(value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8">
      <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Add New Assignment</h1>

        {error && <ErrorAlert errorMessage={error} />}

        <div className="flex-grow overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <SearchInputForm
              id="scheduledTrip-search"
              label="Search for a Scheduled Trip"
              searchTerm={scheduledTripRouteNumber}
              onSearchChange={(value) => setScheduledTripRouteNumber(value)}
              searchResults={scheduledTripSearchResultsFiltered}
              onResultClick={(value) => {
                handleScheduledTripSearch(value);
              }}
              placeholder="Enter scheduled trip route number"
            />
            <TextInput
              id="route-origin"
              label="Route Origin"
              type="text"
              value={scheduledTripViewOnlyRoute?.origin || ""}
              onChange={() => {}}
              readonly={true}
            />
            <SearchInputForm
              id="conductorSearch-search"
              label="Search for a Conductor"
              searchTerm={conductorName}
              onSearchChange={(value) => handleConductorSearchChanges(value)}
              searchResults={conductorSearchResultsFiltered}
              onResultClick={(value) => {
                handleConductorSearchChanges(value);
              }}
              placeholder="Enter conductor name"
            />
            <TextInput
              id="conductor-nic"
              label="Conductor NIC"
              type="text"
              value={conductorViewOnlyNic}
              onChange={() => {}}
              readonly={true}
            />
            <SearchInputForm
              id="driverSearch-search"
              label="Search for a Driver"
              searchTerm={driverName}
              onSearchChange={(value) => handleDriverSearchChanges(value)}
              searchResults={driverSearchResultsFiltered}
              onResultClick={(value) => {
                handleDriverSearchChanges(value);
              }}
              placeholder="Enter driver name"
            />
            <TextInput
              id="driver-nic"
              label="Driver NIC"
              type="text"
              value={viewOnlyDriverNic}
              onChange={() => {}}
              readonly={true}
            />
            {/* Scheduled Trip ID */}
            <TextInput
              id="scheduledTripId"
              label="Scheduled Trip ID"
              type="number"
              value={String(assignment.scheduledTripId)}
              onChange={handleTextInputChange}
            />
            {/* Bus ID */}
            <TextInput
              id="busId"
              label="Bus ID"
              type="number"
              value={String(assignment.busId)}
              onChange={handleTextInputChange}
            />
            {/* Driver ID */}
            <TextInput
              id="driverId"
              label="Driver ID"
              type="number"
              value={String(assignment.driverId)}
              onChange={handleTextInputChange}
            />
            {/* Conductor ID */}
            <TextInput
              id="conductorId"
              label="Conductor ID"
              type="number"
              value={String(assignment.conductorId)}
              onChange={handleTextInputChange}
            />
            {/* Assignment Date */}
            <TextInput
              id="date"
              label="Date"
              type="date"
              value={assignment.date}
              onChange={handleTextInputChange}
            />
            {/* Status */}
            <TextInput
              id="status"
              label="Status"
              type="text"
              value={assignment.status}
              onChange={handleTextInputChange}
            />
            <SearchInputForm
              id="bus-search"
              label="Search for a Bus"
              searchTerm={searchTerm}
              onSearchChange={(value) => handleBusSearchChanges(value)}
              searchResults={busSearchResultsFiltered}
              onResultClick={(value) => {
                handleBusSearchChanges(value);
              }}
              placeholder="Enter bus number or route"
            />

            <TextInput
              id="bus-type"
              label="Bus Type"
              type="text"
              value={viewOnlyBusType}
              onChange={() => {}}
              readonly={true}
            />
          </form>
        </div>
        <div className="mt-8 pt-4 border-t-2 border-gray-200 flex justify-end space-x-4 h-16 items-center">
          <PrimaryButton
            onClick={handleSave}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Create Assignment
          </PrimaryButton>
        </div>
      </div>
      <div className="w-80 bg-gray-200 rounded-lg shadow-xl p-8 flex items-center justify-center text-center">
        <p className="text-gray-500 font-bold">Empty space for future use</p>
      </div>
    </div>
  );
};

export default AddAssignmentPage;
