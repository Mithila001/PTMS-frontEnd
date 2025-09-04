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

// Define an empty ScheduledTrip object without the 'id' and 'route' for the form state
const emptyScheduledTrip: Omit<ScheduledTrip, "id"> = {
  route: {} as Route, // Initialize with empty Route object
  expectedStartTime: "",
  expectedEndTime: "",
  direction: "TO",
};

const AddScheduledTripPage: React.FC = () => {
  const [scheduledTrip, setScheduledTrip] = useState<Omit<ScheduledTrip, "id">>(emptyScheduledTrip);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [routeNumber, setRouteNumber] = useState<string>("");
  const { routeSearchResults } = useRouteSearch(routeNumber);

  const routeNumberSearchResultsFiltered = routeSearchResults.map(
    (route) => `${route.routeNumber}`
  );

  const handleRouteNumberSearch = (value: string) => {
    setRouteNumber(value);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await createScheduledTrip(scheduledTrip);
      console.log("Scheduled trip created successfully.");
      showToast("Scheduled trip created successfully! 👍", "success");
      setScheduledTrip(emptyScheduledTrip); // Reset form after successful submission
      navigate("/admin/scheduledtrips"); // Redirect to the list page
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
            {/* Route ID */}
            <TextInput
              id="route"
              label="Route ID"
              type="number"
              value={String((scheduledTrip.route as any).id || "")}
              onChange={(e) => {
                const value = e.target.value;
                setScheduledTrip((prev) => ({
                  ...prev,
                  route: { id: parseInt(value) || 0 } as Route,
                }));
              }}
            />
            {/* Expected Start Time */}
            <TextInput
              id="expectedStartTime"
              label="Expected Start Time (HH:MM)"
              type="text"
              value={scheduledTrip.expectedStartTime}
              onChange={handleTextInputChange}
            />
            {/* Expected End Time */}
            <TextInput
              id="expectedEndTime"
              label="Expected End Time (HH:MM)"
              type="text"
              value={scheduledTrip.expectedEndTime}
              onChange={handleTextInputChange}
            />
            {/* Direction */}
            <TextInput
              id="direction"
              label="Direction"
              type="text"
              value={scheduledTrip.direction}
              onChange={handleTextInputChange}
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
