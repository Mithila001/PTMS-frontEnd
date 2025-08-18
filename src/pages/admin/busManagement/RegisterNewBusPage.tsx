// src/pages/admin/RegisterNewBusPage.tsx

import React, { useState } from "react";
import { addBus } from "../../../api/busService"; // Make sure to create this new API function
import type { Bus } from "../../../types/bus";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import ErrorAlert from "../../../components/atoms/ErrorAlert";
import TextInput from "../../../components/atoms/TextInput";
import Checkbox from "../../../components/atoms/Checkbox";
import PrimaryButton from "../../../components/atoms/PrimaryButton";

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
            <TextInput
              id="registrationNumber"
              label="Registration Number"
              type="text"
              value={bus.registrationNumber}
              onChange={handleTextInputChange}
            />

            {/* Make */}
            <TextInput
              id="make"
              label="Make"
              type="text"
              value={bus.make}
              onChange={handleTextInputChange}
            />
            {/* Model */}
            <TextInput
              id="model"
              label="Model"
              type="text"
              value={bus.model}
              onChange={handleTextInputChange}
            />
            {/* Year of Manufacture */}
            <TextInput
              id="yearOfManufacture"
              label="Year of Manufacture"
              type="number"
              value={String(bus.yearOfManufacture)}
              onChange={handleTextInputChange}
            />
            {/* Fuel Type */}
            <TextInput
              id="fuelType"
              label="Fuel Type"
              type="text"
              value={bus.fuelType}
              onChange={handleTextInputChange}
            />
            {/* Bus Type */}
            <TextInput
              id="busType"
              label="Bus Type"
              type="text"
              value={bus.busType}
              onChange={handleTextInputChange}
            />
            {/* Seating Capacity */}
            <TextInput
              id="seatingCapacity"
              label="Seating Capacity"
              type="number"
              value={String(bus.seatingCapacity)}
              onChange={handleTextInputChange}
            />
            {/* Standing Capacity */}
            <TextInput
              id="standingCapacity"
              label="Standing Capacity"
              type="number"
              value={String(bus.standingCapacity)}
              onChange={handleTextInputChange}
            />
            {/* NTC Permit Number */}
            <TextInput
              id="ntcPermitNumber"
              label="NTC Permit Number"
              type="number"
              value={String(bus.ntcPermitNumber)}
              onChange={handleTextInputChange}
            />

            {/* Checkboxes for Active and A/C */}
            <div className="grid grid-cols-2 gap-4">
              <Checkbox
                id="active"
                label="Active"
                checked={bus.active}
                onChange={handleTextInputChange}
              />
              <Checkbox id="a_C" label="A/C" checked={bus.a_C} onChange={handleTextInputChange} />
            </div>
          </form>
        </div>
        {error && <ErrorAlert errorMessage={error} />}
        <div className="mt-8 pt-4 border-t-2 border-gray-200 flex justify-end space-x-4 h-16 items-center">
          <PrimaryButton
            onClick={handleSave}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Create Bus
          </PrimaryButton>
        </div>
      </div>
      <div className="w-80 bg-gray-200 rounded-lg shadow-xl p-8 flex items-center justify-center text-center">
        <p className="text-gray-500 font-bold">Empty space for future use</p>
      </div>
    </div>
  );
};

export default RegisterNewBusPage;
