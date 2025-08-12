// src/pages/admin/BusMoreInfoPage.tsx

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { deleteBus, getBusById, updateBus } from "../../api/busService";
import type { Bus } from "../../types/bus";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import ErrorAlert from "../../components/atoms/ErrorAlert";
import isEqual from "lodash.isequal";
import { compareTwoObjects } from "../../utils/compareTwoObjects"; // Assuming this is the correct path

const BusMoreInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(true);
  const busBackup = useRef<Bus | null>(null); // Backup for comparison
  //const [isReadOnly, setIsReadOnly] = useState(true); //Future implementation for access control based on user roles

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

    const comparison = compareTwoObjects(bus as Bus, busBackup.current as Bus);

    if (bus === null) {
      setLoading(false);
      alert("Error!!!! No bus data to save. Please ensure the bus details are loaded correctly.");
      return; // Exit the function early
    }

    // Check if there are no changes
    if (comparison.isMatching) {
      setLoading(false);
      alert("No changes detected. Bus details were not updated. 🤷");
      return; // Exit the function early
    }

    // If there are changes, log them to the console in a human-readable format
    if (comparison.changedLogs.length > 0) {
      console.log("Bus details have been changed. The following updates will be saved:");
      comparison.changedLogs.forEach((log) => {
        console.log(`- Property '${log.key}' changed from '${log.oldValue}' to '${log.newValue}'.`);
      });
    }

    try {
      // If the comparison found changes, proceed with the API call.
      await updateBus(bus.id.toString(), bus);
      console.log("Bus details updated successfully.");
      //alert("Bus details updated successfully! 👍");
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

  if (!bus) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ErrorAlert errorMessage={"No bus data found."} />
      </div>
    );
  }

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setBus((prevBus) => {
      if (!prevBus) return null;

      setHasChanges(true);
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
            {/* Registration Number */}
            <div className="flex flex-col">
              <label htmlFor="registrationNumber" className="text-gray-600 font-semibold mb-1">
                Registration Number
              </label>
              <input
                id="registrationNumber"
                type="text"
                value={bus.registrationNumber}
                readOnly
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Make */}
            <div className="flex flex-col">
              <label htmlFor="make" className="text-gray-600 font-semibold mb-1">
                Make
              </label>
              <input
                id="make"
                type="text"
                value={bus.make}
                onChange={handleTextInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Model */}
            <div className="flex flex-col">
              <label htmlFor="model" className="text-gray-600 font-semibold mb-1">
                Model
              </label>
              <input
                id="model"
                type="text"
                value={bus.model}
                onChange={handleTextInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Year of Manufacture */}
            <div className="flex flex-col">
              <label htmlFor="yearOfManufacture" className="text-gray-600 font-semibold mb-1">
                Year of Manufacture
              </label>
              <input
                id="yearOfManufacture"
                type="number"
                value={bus.yearOfManufacture}
                onChange={handleTextInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Fuel Type */}
            <div className="flex flex-col">
              <label htmlFor="fuelType" className="text-gray-600 font-semibold mb-1">
                Fuel Type
              </label>
              <input
                id="fuelType"
                type="text"
                value={bus.fuelType}
                onChange={handleTextInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Bus Type */}
            <div className="flex flex-col">
              <label htmlFor="busType" className="text-gray-600 font-semibold mb-1">
                Bus Type
              </label>
              <input
                id="busType"
                type="text"
                value={bus.busType}
                onChange={handleTextInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Seating Capacity */}
            <div className="flex flex-col">
              <label htmlFor="seatingCapacity" className="text-gray-600 font-semibold mb-1">
                Seating Capacity
              </label>
              <input
                id="seatingCapacity"
                type="number"
                value={bus.seatingCapacity}
                onChange={handleTextInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Standing Capacity */}
            <div className="flex flex-col">
              <label htmlFor="standingCapacity" className="text-gray-600 font-semibold mb-1">
                Standing Capacity
              </label>
              <input
                id="standingCapacity"
                type="number"
                value={bus.standingCapacity}
                onChange={handleTextInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* NTC Permit Number */}
            <div className="flex flex-col">
              <label htmlFor="ntcPermitNumber" className="text-gray-600 font-semibold mb-1">
                NTC Permit Number
              </label>
              <input
                id="ntcPermitNumber"
                type="number"
                value={bus.ntcPermitNumber}
                onChange={handleTextInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Checkboxes for Active and A/C */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  id="active"
                  type="checkbox"
                  checked={bus.active}
                  onChange={handleTextInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="active" className="text-gray-600 font-semibold">
                  Active
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="a_C"
                  type="checkbox"
                  checked={bus.a_C}
                  onChange={handleTextInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="a_C" className="text-gray-600 font-semibold">
                  A/C
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Second Row: Save and Delete Buttons */}
        <div className="mt-8 pt-4 border-t-2 border-gray-200 flex justify-end space-x-4 h-16 items-center">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Save
          </button>
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
