// src/pages/admin/BusMoreInfoPage.tsx

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { deleteBus, getBusById, updateBus } from "../../../api/busService";
import type { Bus } from "../../../types/bus";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import ErrorAlert from "../../../components/atoms/ErrorAlert";
import isEqual from "lodash.isequal";
import { compareTwoObjects } from "../../../utils/compareTwoObjects";
import TextInput from "../../../components/atoms/TextInput";
import Checkbox from "../../../components/atoms/Checkbox";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import Dropdown from "../../../components/atoms/Dropdown"; // <--- NEW IMPORT
import { useApplicationData } from "../../../contexts/ApplicationDataContext"; // <--- NEW IMPORT

const BusMoreInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const busBackup = useRef<Bus | null>(null);

  // Use the context to get application data
  const { enums, loading: enumsLoading, error: enumsError } = useApplicationData();

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      getBusById(id)
        .then((busData) => {
          if (busData) {
            setBus(busData);
            busBackup.current = busData;
          } else {
            setError(`No bus found with ID: ${id}`);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch bus details:", err);
          setError("Failed to fetch bus details. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No bus ID provided in the URL.");
      setLoading(false);
    }
  }, [id]);

  const handleSave = async () => {
    setLoading(true);

    if (bus === null) {
      setLoading(false);
      alert("Error!!!! No bus data to save. Please ensure the bus details are loaded correctly.");
      return;
    }

    const comparison = compareTwoObjects(bus as Bus, busBackup.current as Bus);

    if (comparison.isMatching) {
      setLoading(false);
      alert("No changes detected. Bus details were not updated. 🤷");
      return;
    }

    if (comparison.changedLogs.length > 0) {
      console.log("Bus details have been changed. The following updates will be saved:");
      comparison.changedLogs.forEach((log) => {
        console.log(`- Property '${log.key}' changed from '${log.oldValue}' to '${log.newValue}'.`);
      });
    }

    try {
      await updateBus(bus.id.toString(), bus);
      console.log("Bus details updated successfully.");
      busBackup.current = bus;
    } catch (error) {
      console.error("Failed to save bus details:", error);
      alert("Failed to save changes. Please try again. 😢");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this bus? This action cannot be undone."
    );

    if (isConfirmed) {
      deleteBus(id as string)
        .then(() => {
          window.location.href = "/admin/buses";
        })
        .catch((error) => {
          console.error("Failed to delete bus:", error);
          alert("Failed to delete bus. Please try again. 😢");
        });
    } else {
      console.log("Bus deletion cancelled.");
    }
  };

  // Combine loading states from both API call and context
  const isLoading = loading || enumsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  // Combine error states
  const pageError = error || enumsError;
  if (pageError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ErrorAlert errorMessage={pageError} />
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ErrorAlert errorMessage={"No bus data found."} />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setBus((prevBus) => {
      if (!prevBus) return null;

      return {
        ...prevBus,
        [id]: type === "checkbox" ? checked : value,
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8">
      {/* Left Column: Form and Buttons */}
      <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          Bus Details: {bus.registrationNumber}
        </h1>

        {/* First Row: Form Inputs */}
        <div className="flex-grow overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Registration Number (Read-only) */}
            <TextInput
              id="registrationNumber"
              label="Registration Number"
              value={bus.registrationNumber}
              onChange={handleInputChange}
              readonly={false}
            />
            {/* Make */}
            <TextInput id="make" label="Make" value={bus.make} onChange={handleInputChange} />
            {/* Model */}
            <TextInput id="model" label="Model" value={bus.model} onChange={handleInputChange} />
            {/* Year of Manufacture */}
            <TextInput
              id="yearOfManufacture"
              label="Year of Manufacture"
              type="number"
              value={String(bus.yearOfManufacture)}
              onChange={handleInputChange}
            />
            {/* Fuel Type */}
            <Dropdown
              id="fuelType"
              label="Fuel Type"
              options={enums.fuelType}
              value={bus.fuelType}
              onChange={handleInputChange}
            />
            {/* Service Type */} {/* <--- NEW DROPDOWN */}
            <Dropdown
              id="serviceType"
              label="Service Type"
              options={enums.serviceType}
              value={bus.serviceType}
              onChange={handleInputChange}
            />
            {/* Bus Comfort Type */}
            <Dropdown
              id="comfortType"
              label="Bus Comfort Type"
              options={enums.comfortType}
              value={bus.comfortType}
              onChange={handleInputChange}
            />
            {/* Seating Capacity */}
            <TextInput
              id="seatingCapacity"
              label="Seating Capacity"
              type="number"
              value={String(bus.seatingCapacity)}
              onChange={handleInputChange}
            />
            {/* Standing Capacity */}
            <TextInput
              id="standingCapacity"
              label="Standing Capacity"
              type="number"
              value={String(bus.standingCapacity)}
              onChange={handleInputChange}
            />
            {/* NTC Permit Number */}
            <TextInput
              id="ntcPermitNumber"
              label="NTC Permit Number"
              type="number"
              value={String(bus.ntcPermitNumber)}
              onChange={handleInputChange}
            />
            {/* Checkboxes for Active and A/C */}
            <div className="grid grid-cols-2 gap-4">
              <Checkbox
                id="active"
                label="Active"
                checked={bus.active}
                onChange={handleInputChange}
              />
              <Checkbox id="isA_C" label="A/C" checked={bus.isA_C} onChange={handleInputChange} />
            </div>
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

export default BusMoreInfoPage;
