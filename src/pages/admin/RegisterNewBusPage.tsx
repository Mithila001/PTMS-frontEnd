// src/pages/admin/RegisterNewBusPage.tsx

import React, { useState } from "react";
import { addBus } from "../../api/busService"; // Make sure to create this new API function
import type { Bus } from "../../types/bus";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import ErrorAlert from "../../components/atoms/ErrorAlert";

const emptyBus: Omit<Bus, "id"> = {
  registrationNumber: "",
  make: "",
  model: "",
  yearOfManufacture: 1, // Default to current year or a sensible default
  fuelType: "",
  busType: "",
  seatingCapacity: 0,
  standingCapacity: 0,
  ntcPermitNumber: -1,
  active: true,
  a_C: false,
};

const RegisterNewBusPage: React.FC = () => {
  const [bus, setBus] = useState<Omit<Bus, "id">>(emptyBus);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      // API call to add the new bus
      await addBus(bus);
      console.log("Bus created successfully.");
      alert("Bus created successfully! 👍");
      setBus(emptyBus); // Reset form after successful submission
    } catch (error) {
      console.error("Failed to save bus details:", error);
      setError("Failed to create bus. Please try again. 😢");
    } finally {
      setLoading(false);
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setBus((prevBus) => {
      return {
        ...prevBus,
        [id]: type === "checkbox" ? checked : value,
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Register New Bus</h1>

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
                onChange={handleTextInputChange}
                className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
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
                className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
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
                className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
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
                className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
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
                className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
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
                className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
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
                className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
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
                className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
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
                className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
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
        {error && <ErrorAlert errorMessage={error} />}
        <div className="mt-8 pt-4 border-t-2 border-gray-200 flex justify-end space-x-4 h-16 items-center">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Create Bus
          </button>
        </div>
      </div>
      <div className="w-80 bg-gray-200 rounded-lg shadow-xl p-8 flex items-center justify-center text-center">
        <p className="text-gray-500 font-bold">Empty space for future use</p>
      </div>
    </div>
  );
};

export default RegisterNewBusPage;
