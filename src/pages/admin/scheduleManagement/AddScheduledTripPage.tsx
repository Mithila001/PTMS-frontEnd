// src/pages/admin/assignmentManagement/AddScheduledTripPage.tsx

import React, { use, useState } from "react";
import { createScheduledTrip } from "../../../api/scheduledTripService";
import type { ScheduledTrip } from "../../../types/assignment";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import TextInput from "../../../components/atoms/TextInput";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import { useNavigate } from "react-router-dom";
import type { Route } from "../../../types/route";
import { useToast } from "../../../contexts/ToastContext";
import SearchInputForm from "../../../components/molecules/SearchInputForm";
import { useRouteSearch } from "../../../hooks/search/useRouteSearch";
import Dropdown from "../../../components/atoms/Dropdown";
import type { TripDirection } from "../../../types/assignment";
import TimeInput from "../../../components/atoms/TimeInput";

// Define an empty ScheduledTrip object without the 'id' and 'route' for the form state
const emptyScheduledTrip: Omit<ScheduledTrip, "id"> = {
  route: {} as Route, // Initialize with empty Route object
  expectedStartTime: null,
  expectedEndTime: null,
  direction: "TO" as TripDirection,
};

const AddScheduledTripPage: React.FC = () => {
  const [scheduledTrip, setScheduledTrip] = useState<Omit<ScheduledTrip, "id">>(emptyScheduledTrip);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [routeNumber, setRouteNumber] = useState<string>("");
  const { routeSearchResults } = useRouteSearch(routeNumber);

  const tripDirectionOptions: TripDirection[] = ["TO", "FROM"];

  const routeNumberSearchResultsFiltered = routeSearchResults.map(
    (route) => `${route.routeNumber}`
  );

  const handleRouteNumberSearch = (value: string) => {
    // Find the complete Route object that matches the selected route number.
    const selectedRoute = routeSearchResults.find((route) => route.routeNumber === value);
    setRouteNumber(value);

    // Update the scheduled trip with the full selected route object, or a new empty object if not found.
    setScheduledTrip((prev) => ({
      ...prev,
      route: selectedRoute || ({} as Route), // Revert to using a placeholder object
    }));
  };

  const handleSave = async () => {
    // Check if a valid route has been selected before proceeding
    if (!scheduledTrip.route || !scheduledTrip.route.id) {
      showToast("Please select a valid route before saving. ⚠️", "error");
      return;
    }

    setLoading(true);
    try {
      console.log("Scheduled trip details:", scheduledTrip);
      await createScheduledTrip(scheduledTrip);
      console.log("Scheduled trip created successfully.");
      showToast("Scheduled trip created successfully! 👍", "success");
      setScheduledTrip(emptyScheduledTrip); // Reset form after successful submission
      navigate("/admin/scheduled-trips"); // Redirect to the list page
    } catch (error) {
      console.error("Failed to save scheduled trip details:", error);
      showToast("Failed to create scheduled trip. Please try again. 😢", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setScheduledTrip((prevTrip) => ({
      ...prevTrip,
      [id]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setScheduledTrip((prev) => ({
      ...prev,
      direction: value as TripDirection,
    }));
  };

  const handleTimeInputChange = (
    time: Date | null,
    id: "expectedStartTime" | "expectedEndTime"
  ) => {
    setScheduledTrip((prev) => ({
      ...prev,
      [id]: time,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8">
      <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          Add New Scheduled Trip
        </h1>

        <div className="flex-grow overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <SearchInputForm
              id="routeNumber-search"
              label="Search Route Number"
              searchTerm={routeNumber}
              onSearchChange={(value) => setRouteNumber(value)}
              searchResults={routeNumberSearchResultsFiltered}
              onResultClick={(value) => {
                handleRouteNumberSearch(value);
              }}
              placeholder="Enter scheduled trip route number"
            />

            {/* Expected Start Time */}
            <TimeInput
              id="expectedStartTime"
              label="Expected Start Time"
              value={scheduledTrip.expectedStartTime}
              onChange={(time) => handleTimeInputChange(time, "expectedStartTime")}
            />
            {/* Expected End Time */}
            <TimeInput
              id="expectedEndTime"
              label="Expected End Time"
              value={scheduledTrip.expectedEndTime}
              onChange={(time) => handleTimeInputChange(time, "expectedEndTime")}
            />

            <Dropdown
              id="direction"
              label="Direction"
              options={tripDirectionOptions}
              value={scheduledTrip.direction}
              onChange={handleDirectionChange}
            />
          </form>
        </div>
        <div className="mt-8 pt-4 border-t-2 border-gray-200 flex justify-end space-x-4 h-16 items-center">
          <PrimaryButton
            onClick={handleSave}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Create Scheduled Trip
          </PrimaryButton>
        </div>
      </div>
      <div className="w-80 bg-gray-200 rounded-lg shadow-xl p-8 flex items-center justify-center text-center">
        <p className="text-gray-500 font-bold">Empty space for future use</p>
      </div>
    </div>
  );
};

export default AddScheduledTripPage;
