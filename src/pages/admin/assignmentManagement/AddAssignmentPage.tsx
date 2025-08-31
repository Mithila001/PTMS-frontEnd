// src/pages/admin/assignmentManagement/AddAssignmentPage.tsx

import React, { useState } from "react";
import { createAssignment } from "../../../api/assignmentService";
import type { Assignment } from "../../../types/assignment";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import ErrorAlert from "../../../components/atoms/ErrorAlert";
import TextInput from "../../../components/atoms/TextInput";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8">
      <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Add New Assignment</h1>

        {error && <ErrorAlert errorMessage={error} />}

        <div className="flex-grow overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
