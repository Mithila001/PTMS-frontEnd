// ptms-frontEnd\src\pages\admin\busManagement\RegisterNewBusPage.tsx

import React, { useState } from "react";
import { addBus } from "../../../api/busService";
import type { Bus } from "../../../types/bus";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import TextInput from "../../../components/atoms/TextInput";
import Checkbox from "../../../components/atoms/Checkbox";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import Dropdown from "../../../components/atoms/Dropdown";
import { useApplicationData } from "../../../contexts/ApplicationDataContext";
import { formatErrorMessage } from "../../../utils/errorFormatter";
import { useToast } from "../../../contexts/ToastContext";
import { busValidationSchema } from "../../../schemas/busValidation";
import { useValidation } from "../../../hooks/useValidation";

const emptyBus: Omit<Bus, "id"> = {
  registrationNumber: "",
  make: "",
  model: "",
  yearOfManufacture: new Date().getFullYear(),
  fuelType: "",
  serviceType: "",
  comfortType: "",
  seatingCapacity: 0,
  standingCapacity: 0,
  ntcPermitNumber: 0,
  active: true,
  isA_C: false,
};

const RegisterNewBusPage: React.FC = () => {
  const [bus, setBus] = useState<Omit<Bus, "id">>(emptyBus);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Use the context to get application data
  const { enums } = useApplicationData();
  const { showToast } = useToast();
  const { errors, isFormValid } = useValidation(bus, busValidationSchema);

  const handleSave = async () => {
    setSubmitted(true);
    if (!isFormValid) {
      showToast("Please correct the form errors.", "error");
      return;
    }
    setLoading(true);

    try {
      await addBus(bus);
      console.log("Bus created successfully.");
      showToast("Bus created successfully!", "success");
      setBus(emptyBus); // Reset form after successful submission
      setSubmitted(false);
    } catch (error) {
      console.error("Failed to save bus details:", error);
      const errorMessage = formatErrorMessage(error);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setBus((prevBus) => {
      if (!prevBus) return emptyBus;
      return {
        ...prevBus,
        [id]: type === "checkbox" ? checked : value,
      };
    });
  };

  // Combine loading states from both API call and context
  const isLoading = loading;

  if (isLoading) {
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
              onChange={handleInputChange}
              errorMessage={errors.registrationNumber}
              submitted={submitted}
            />
            {/* Make */}
            <TextInput
              id="make"
              label="Make"
              type="text"
              value={bus.make}
              onChange={handleInputChange}
              errorMessage={errors.make}
              submitted={submitted}
            />
            {/* Model */}
            <TextInput
              id="model"
              label="Model"
              type="text"
              value={bus.model}
              onChange={handleInputChange}
              errorMessage={errors.model}
              submitted={submitted}
            />
            {/* Year of Manufacture */}
            <TextInput
              id="yearOfManufacture"
              label="Year of Manufacture"
              type="number"
              value={String(bus.yearOfManufacture)}
              onChange={handleInputChange}
              errorMessage={errors.yearOfManufacture}
              submitted={submitted}
            />
            {/* Fuel Type */}
            <Dropdown
              id="fuelType"
              label="Fuel Type"
              options={enums.fuelType}
              value={bus.fuelType}
              onChange={handleInputChange}
              errorMessage={errors.fuelType}
              submitted={submitted}
            />
            {/* Service Type */}
            <Dropdown
              id="serviceType"
              label="Service Type"
              options={enums.serviceType}
              value={bus.serviceType}
              onChange={handleInputChange}
              errorMessage={errors.serviceType}
              submitted={submitted}
            />
            {/* Bus Comfort Type */}
            <Dropdown
              id="comfortType"
              label="Bus Comfort Type"
              options={enums.comfortType}
              value={bus.comfortType}
              onChange={handleInputChange}
              errorMessage={errors.comfortType}
              submitted={submitted}
            />
            {/* Seating Capacity */}
            <TextInput
              id="seatingCapacity"
              label="Seating Capacity"
              type="number"
              value={String(bus.seatingCapacity)}
              onChange={handleInputChange}
              errorMessage={errors.seatingCapacity}
              submitted={submitted}
            />
            {/* Standing Capacity */}
            <TextInput
              id="standingCapacity"
              label="Standing Capacity"
              type="number"
              value={String(bus.standingCapacity)}
              onChange={handleInputChange}
              errorMessage={errors.standingCapacity}
              submitted={submitted}
            />
            {/* NTC Permit Number */}
            <TextInput
              id="ntcPermitNumber"
              label="NTC Permit Number"
              type="number"
              value={String(bus.ntcPermitNumber)}
              onChange={handleInputChange}
              errorMessage={errors.ntcPermitNumber}
              submitted={submitted}
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
