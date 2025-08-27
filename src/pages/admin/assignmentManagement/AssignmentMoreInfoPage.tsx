// src/pages/admin/assignmentManagement/AssignmentMoreInfoPage.tsx

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from "../../../api/assignmentService";
import type { Assignment } from "../../../types/assignment";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import ErrorAlert from "../../../components/atoms/ErrorAlert";
import TextInput from "../../../components/atoms/TextInput";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import { compareTwoObjects } from "../../../utils/compareTwoObjects";
import { useNavigate } from "react-router-dom";

const AssignmentMoreInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const assignmentBackup = useRef<Assignment | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      getAssignmentById(parseInt(id))
        .then((assignmentData) => {
          if (assignmentData) {
            setAssignment(assignmentData);
            assignmentBackup.current = assignmentData;
          } else {
            setError(`No assignment found with ID: ${id}`);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch assignment details:", err);
          setError("Failed to fetch assignment details. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No assignment ID provided in the URL.");
      setLoading(false);
    }
  }, [id]);

  const handleSave = async () => {
    setLoading(true);

    const comparison = compareTwoObjects(
      assignment as Assignment,
      assignmentBackup.current as Assignment
    );

    if (assignment === null) {
      setLoading(false);
      alert(
        "Error! No assignment data to save. Please ensure the assignment details are loaded correctly."
      );
      return;
    }

    if (comparison.isMatching) {
      setLoading(false);
      alert("No changes detected. Assignment details were not updated. 🤷");
      return;
    }

    if (comparison.changedLogs.length > 0) {
      console.log("Assignment details have been changed. The following updates will be saved:");
      comparison.changedLogs.forEach((log) => {
        console.log(`- Property '${log.key}' changed from '${log.oldValue}' to '${log.newValue}'.`);
      });
    }

    try {
      await updateAssignment(assignment.id, assignment);
      console.log("Assignment details updated successfully.");
      assignmentBackup.current = assignment;
    } catch (error) {
      console.error("Failed to save assignment details:", error);
      alert("Failed to save changes. Please try again. 😢");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this assignment? This action cannot be undone."
    );

    if (isConfirmed && assignment) {
      deleteAssignment(assignment.id)
        .then(() => {
          navigate("/admin/assignments");
        })
        .catch((error) => {
          console.error("Failed to delete assignment:", error);
          alert("Failed to delete assignment. Please try again. 😢");
        });
    } else {
      console.log("Assignment deletion cancelled.");
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAssignment((prevAssignment) => {
      if (!prevAssignment) return null;
      return {
        ...prevAssignment,
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ErrorAlert errorMessage={error} />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ErrorAlert errorMessage={"No assignment data found."} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8">
      {/* Left Column: Form and Buttons */}
      <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Assignment Details</h1>

        {/* First Row: Form Inputs */}
        <div className="flex-grow overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Assignment ID (Read-only) */}
            <TextInput
              id="assignmentId"
              label="Assignment ID"
              value={String(assignment.id)}
              onChange={handleTextInputChange}
              readonly={true}
            />
            {/* Route Number */}
            <TextInput
              id="routeNumber"
              label="Route Number"
              value={assignment.scheduledTrip?.route.routeNumber || ""}
              onChange={handleTextInputChange}
            />
            {/* Bus Registration Number */}
            <TextInput
              id="busRegistrationNumber"
              label="Bus Registration Number"
              value={assignment.busRegistrationNumber || ""}
              onChange={handleTextInputChange}
            />
            {/* Driver Name */}
            <TextInput
              id="driverName"
              label="Driver"
              value={assignment.driverName || ""}
              onChange={handleTextInputChange}
            />
            {/* Conductor Name */}
            <TextInput
              id="conductorName"
              label="Conductor"
              value={assignment.conductorName || ""}
              onChange={handleTextInputChange}
            />
            {/* Assignment Date */}
            <TextInput
              id="date"
              label="Date"
              value={assignment.date}
              onChange={handleTextInputChange}
            />
            {/* Status */}
            <TextInput
              id="status"
              label="Status"
              value={assignment.status}
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

export default AssignmentMoreInfoPage;
