// src/pages/admin/employeeManagement/ConductorMoreInfoPage.tsx

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import ErrorAlert from "../../../components/atoms/ErrorAlert";
import { compareTwoObjects } from "../../../utils/compareTwoObjects";
import type { Conductor } from "../../../types/employee";
import Checkbox from "../../../components/atoms/Checkbox";
import TextInput from "../../../components/atoms/TextInput";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import { deleteConductor, getConductorById, updateConductor } from "../../../api/conductorService";

const ConductorMoreInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [conductor, setConductor] = useState<Conductor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const conductorBackup = useRef<Conductor | null>(null);
  const [conductorId, setConductorId] = useState<number | null>(null);

  useEffect(() => {
    console.log("ID:", id);
    if (id) {
      const parsedId = Number(id);
      setConductorId(parsedId);
      if (isNaN(parsedId)) {
        setError("Invalid Conductor ID provided in the URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      getConductorById(parsedId)
        .then((conductorData) => {
          if (conductorData) {
            setConductor(conductorData);
            conductorBackup.current = conductorData;
            //console.log("Conductor data fetched successfully:", conductorData);
          } else {
            setError(`No conductor found with ID: ${id}`);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch conductor details:", err);
          setError("Failed to fetch conductor details. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No conductor ID provided in the URL.");
      setLoading(false);
    }
  }, [id]);

  const handleSave = async () => {
    if (conductor === null || conductorId === null || isNaN(conductorId)) {
      alert("Error: No valid conductor data or ID to save.");
      return;
    }

    setLoading(true);

    const comparison = compareTwoObjects(
      conductor as Conductor,
      conductorBackup.current as Conductor
    );

    if (comparison.isMatching) {
      setLoading(false);
      alert("No changes detected. Conductor details were not updated. 🤷");
      return;
    }

    if (comparison.changedLogs.length > 0) {
      console.log("Conductor details have been changed. The following updates will be saved:");
      comparison.changedLogs.forEach((log) => {
        console.log(`- Property '${log.key}' changed from '${log.oldValue}' to '${log.newValue}'.`);
      });
    }

    try {
      await updateConductor(conductorId, conductor);
      console.log("Conductor details updated successfully.");
      conductorBackup.current = conductor;
    } catch (error) {
      console.error("Failed to save conductor details:", error);
      alert("Failed to save changes. Please try again. 😢");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this conductor? This action cannot be undone."
    );

    if (isConfirmed && conductorId !== null && !isNaN(conductorId)) {
      deleteConductor(conductorId)
        .then(() => {
          window.location.href = "/admin/employees";
        })
        .catch((error) => {
          console.error("Failed to delete conductor:", error);
          alert("Failed to delete conductor. Please try again. 😢");
        });
    } else if (isConfirmed && (conductorId === null || isNaN(conductorId))) {
      alert("Invalid conductor ID for deletion. 😢");
    } else {
      console.log("Conductor deletion cancelled.");
    }
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

  if (!conductor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ErrorAlert errorMessage={"No conductor data found."} />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;

    setConductor((prevConductor) => {
      if (!prevConductor) return null;

      return {
        ...prevConductor,
        [id]: type === "checkbox" ? checked : value,
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8">
      {/* Left Column: Form and Buttons */}
      <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          Conductor Details: {`${conductor.firstName} ${conductor.lastName}`}
        </h1>
        <div className="flex-grow overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* First Name */}
            <TextInput
              id="firstName"
              label="First Name"
              value={conductor.firstName}
              onChange={handleInputChange}
            />
            {/* Last Name */}
            <TextInput
              id="lastName"
              label="Last Name"
              value={conductor.lastName}
              onChange={handleInputChange}
            />
            {/* NIC Number */}
            <TextInput
              id="nicNumber"
              label="NIC Number"
              value={conductor.nicNumber}
              onChange={handleInputChange}
            />
            {/* Date of Birth */}
            <TextInput
              id="dateOfBirth"
              label="Date of Birth"
              type="date"
              value={conductor.dateOfBirth}
              onChange={handleInputChange}
            />
            {/* Contact Number */}
            <TextInput
              id="contactNumber"
              label="Contact Number"
              type="tel"
              value={conductor.contactNumber}
              onChange={handleInputChange}
            />
            {/* Email */}
            <TextInput
              id="email"
              label="Email"
              type="email"
              value={conductor.email}
              onChange={handleInputChange}
            />
            {/* Address - full width field */}
            <div className="md:col-span-2">
              <TextInput
                id="address"
                label="Address"
                value={conductor.address}
                onChange={handleInputChange}
              />
            </div>
            {/* Date Joined */}
            <TextInput
              id="dateJoined"
              label="Date Joined"
              type="date"
              value={conductor.dateJoined}
              onChange={handleInputChange}
            />
            {/* Conductor License Number */}
            <TextInput
              id="conductorLicenseNumber"
              label="Conductor License Number"
              value={conductor.conductorLicenseNumber}
              onChange={handleInputChange}
            />
            {/* License Expiration Date */}
            <TextInput
              id="licenseExpirationDate"
              label="License Expiration Date"
              type="date"
              value={conductor.licenseExpirationDate}
              onChange={handleInputChange}
            />
            {/* Is Current Employee & Available */}
            <div className="flex items-center gap-4 mt-2">
              <Checkbox
                id="isCurrentEmployee"
                label="Is Current Employee"
                checked={conductor.isCurrentEmployee}
                onChange={handleInputChange}
              />
              <Checkbox
                id="available"
                label="Is Available"
                checked={conductor.available}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </div>

        {/* Buttons */}
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

      <div className="w-80 bg-gray-200 rounded-lg shadow-xl p-8 flex items-center justify-center text-center">
        <p className="text-gray-500 font-bold">Empty space for future use</p>
      </div>
    </div>
  );
};

export default ConductorMoreInfoPage;
