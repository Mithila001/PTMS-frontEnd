// src/pages/admin/assignmentManagement/ScheduledTripsMoreInfoPage.tsx

import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getScheduledTripById,
  updateScheduledTrip,
  deleteScheduledTrip,
} from "../../../api/scheduledTripService";
import type { ScheduledTrip } from "../../../types/assignment";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import TextInput from "../../../components/atoms/TextInput";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import { compareTwoObjects } from "../../../utils/compareTwoObjects";
import { useToast } from "../../../contexts/ToastContext";

const ScheduledTripsMoreInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scheduledTrip, setScheduledTrip] = useState<ScheduledTrip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const scheduledTripBackup = useRef<ScheduledTrip | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getScheduledTripById(parseInt(id))
        .then((tripData) => {
          if (tripData) {
            setScheduledTrip(tripData);
            scheduledTripBackup.current = tripData;
          } else {
            showToast(`No scheduled trip found with ID: ${id}`, "error");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch scheduled trip details:", err);
          showToast("Failed to fetch scheduled trip details. Please try again.", "error");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      showToast("No scheduled trip ID provided in the URL.", "error");
      setLoading(false);
    }
  }, [id, showToast]);

  const handleSave = async () => {
    setLoading(true);

    if (scheduledTrip === null) {
      setLoading(false);
      showToast(
        "Error! No scheduled trip data to save. Please ensure the trip details are loaded correctly.",
        "error"
      );
      return;
    }

    const comparison = compareTwoObjects(
      scheduledTrip as ScheduledTrip,
      scheduledTripBackup.current as ScheduledTrip
    );

    if (comparison.isMatching) {
      setLoading(false);
      showToast("No changes detected. Scheduled trip details were not updated. 🤷", "info");
      return;
    }

    if (comparison.changedLogs.length > 0) {
      console.log("Scheduled trip details have been changed. The following updates will be saved:");
      comparison.changedLogs.forEach((log) => {
        console.log(`- Property '${log.key}' changed from '${log.oldValue}' to '${log.newValue}'.`);
      });
    }

    try {
      await updateScheduledTrip(scheduledTrip.id, scheduledTrip);
      console.log("Scheduled trip details updated successfully.");
      showToast("Scheduled trip details updated successfully!", "success");
      scheduledTripBackup.current = scheduledTrip;
    } catch (error) {
      console.error("Failed to save scheduled trip details:", error);
      showToast("Failed to save changes. Please try again. 😢", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this scheduled trip? This action cannot be undone."
    );

    if (isConfirmed && scheduledTrip) {
      deleteScheduledTrip(scheduledTrip.id)
        .then(() => {
          showToast("Scheduled trip deleted successfully!", "success");
          navigate("/admin/scheduledtrips");
        })
        .catch((error) => {
          console.error("Failed to delete scheduled trip:", error);
          showToast("Failed to delete scheduled trip. Please try again. 😢", "error");
        });
    } else {
      console.log("Scheduled trip deletion cancelled.");
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setScheduledTrip((prevTrip) => {
      if (!prevTrip) return null;
      return {
        ...prevTrip,
        [id]: value,
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

  if (!scheduledTrip) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">No scheduled trip data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8">
      {/* Left Column: Form and Buttons */}
      <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          Scheduled Trip Details
        </h1>

        {/* First Row: Form Inputs */}
        <div className="flex-grow overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Trip ID (Read-only) */}
            <TextInput
              id="tripId"
              label="Trip ID"
              value={String(scheduledTrip.id)}
              onChange={handleTextInputChange}
              readonly={true}
            />
            {/* Route Number (Read-only) */}
            <TextInput
              id="routeNumber"
              label="Route Number"
              value={scheduledTrip.route?.routeNumber || ""}
              onChange={handleTextInputChange}
              readonly={true}
            />
            {/* Expected Start Time */}
            <TextInput
              id="expectedStartTime"
              label="Expected Start Time"
              value={scheduledTrip.expectedStartTime}
              onChange={handleTextInputChange}
            />
            {/* Expected End Time */}
            <TextInput
              id="expectedEndTime"
              label="Expected End Time"
              value={scheduledTrip.expectedEndTime}
              onChange={handleTextInputChange}
            />
          </form>
        </div>

        {/* Second Row: Save and Delete Buttons */}
        <div className="mt-8 pt-4 border-t-2 border-gray-200 flex justify-end space-x-4 h-16 items-center">
          <PrimaryButton
            onClick={handleDelete}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
          >
            Delete
          </PrimaryButton>
          <PrimaryButton
            onClick={handleSave}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Save
          </PrimaryButton>
        </div>
      </div>

      {/* Right Column: Fixed Width Space */}
      <div className="w-80 bg-gray-200 rounded-lg shadow-xl p-8 flex items-center justify-center text-center">
        <p className="text-gray-500 font-bold">Empty space for future use</p>
      </div>
    </div>
  );
};

export default ScheduledTripsMoreInfoPage;
