// src/pages/admin/assignmentManagement/AddAssignmentPage.tsx

import React, { useRef, useState } from "react";
import { createAssignment } from "../../../api/assignmentService";
import type { Assignment, AssignmentStatus } from "../../../types/assignment";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import TextInput from "../../../components/atoms/TextInput";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useBusData } from "../../../hooks/data/useBusData";
import SearchInputForm from "../../../components/molecules/SearchInputForm";
import { useEmployeeSearch } from "../../../hooks/data/useEmployeeSearch";
import { useScheduledTripSearch } from "../../../hooks/data/useScheduledTripSearch";
import type { Route } from "../../../types/route";
import DateInput from "../../../components/atoms/DateInput";
import TimeInput from "../../../components/atoms/TimeInput";
import { useToast } from "../../../contexts/ToastContext";

// Define an initial state for a new assignment based on the new interface
// We'll use a type that aligns with the 'createAssignment' API call
type NewAssignmentData = Omit<Assignment, "id" | "scheduledTrip"> & {
  scheduledTripId: string;
  actualStartTime: Date | null;
  actualEndTime: Date | null;
  date: Date | null;
  busId: number;
  driverId: number;
  conductorId: number;
  status: AssignmentStatus;
  driverName?: string;
  conductorName?: string;
  busRegistrationNumber?: string;
};

const emptyAssignment: NewAssignmentData = {
  scheduledTripId: "",
  busId: 0,
  driverId: 0,
  conductorId: 0,
  date: new Date(),
  actualStartTime: null,
  actualEndTime: null,
  status: "IN_PROGRESS",
  driverName: "",
  conductorName: "",
  busRegistrationNumber: "",
};

const AddAssignmentPage: React.FC = () => {
  const [assignment, setAssignment] = useState<NewAssignmentData>(emptyAssignment);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewOnlyBusType, setViewOnlyBusType] = useState<string>("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const selectedFilter = useRef<string>("");

  const { busSearchResults } = useBusData(searchTerm, selectedFilter.current);
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

    try {
      // Basic validation remains
      if (
        !assignment.scheduledTripId ||
        !assignment.busId ||
        !assignment.driverId ||
        !assignment.conductorId ||
        !assignment.date
      ) {
        showToast(
          "All fields (Scheduled Trip, Bus, Driver, Conductor, Date) are required.",
          "error"
        );
        setLoading(false);
        return;
      }

      // Pass the state object directly to the API function
      await createAssignment(assignment);

      console.log("Assignment created successfully.");
      showToast("Assignment created successfully! 👍", "success");
      setAssignment(emptyAssignment);
      navigate("/admin/assignments");
    } catch (error) {
      console.error("Failed to save assignment details:", error);
      showToast("Failed to create assignment. Please try again. 😢", "error");
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
        scheduledTripId: selectedTrip.id.toString(),
      }));

      setScheduledTripViewOnlyRoute(selectedTrip.route);
    }

    setScheduledTripRouteNumber(value);
  };

  const handleDateChange = (date: Date | null) => {
    setAssignment((prev) => ({ ...prev, date }));
  };

  const handleStartTimeChange = (time: Date | null) => {
    setAssignment((prev) => ({ ...prev, actualStartTime: time }));
  };

  const handleEndTimeChange = (time: Date | null) => {
    setAssignment((prev) => ({ ...prev, actualEndTime: time }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8">
      <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Add New Assignment</h1>

        <div className="flex-grow overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Route Section */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Route</h3>
              <hr className="mb-4 border-gray-300" />
            </div>
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
            <div className="flex flex-col space-y-4">
              <TextInput
                id="route-origin"
                label="Route Origin"
                type="text"
                value={scheduledTripViewOnlyRoute?.origin || ""}
                onChange={() => {}}
                readonly={true}
              />
              <TextInput
                id="route-destination"
                label="Route Destination"
                type="text"
                value={scheduledTripViewOnlyRoute?.destination || ""}
                onChange={() => {}}
                readonly={true}
              />
            </div>

            {/* Employee Section */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Employee</h3>
              <hr className="mb-4 border-gray-300" />
            </div>
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

            {/* Bus Section */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Bus</h3>
              <hr className="mb-4 border-gray-300" />
            </div>
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

            {/* Other Info Section */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Other Info</h3>
              <hr className="mb-4 border-gray-300" />
            </div>
            <DateInput id="date" label="Date" value={assignment.date} onChange={handleDateChange} />
            <TextInput
              id="status"
              label="Status"
              type="text"
              value={assignment.status}
              onChange={() => {}}
              readonly={true}
            />
            <TimeInput
              id="actualStartTime"
              label="Start Time"
              value={assignment.actualStartTime}
              onChange={handleStartTimeChange}
            />
            <TimeInput
              id="actualEndTime"
              label="End Time"
              value={assignment.actualEndTime}
              onChange={handleEndTimeChange}
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
