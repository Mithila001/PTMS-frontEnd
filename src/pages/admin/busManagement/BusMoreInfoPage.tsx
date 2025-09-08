// src/pages/admin/BusMoreInfoPage.tsx

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { deleteBus, getBusById, updateBus } from "../../../api/busService";
import type { Bus } from "../../../types/bus";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import { compareTwoObjects } from "../../../utils/compareTwoObjects";
import TextInput from "../../../components/atoms/TextInput";
import Checkbox from "../../../components/atoms/Checkbox";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import Dropdown from "../../../components/atoms/Dropdown";
import { useApplicationData } from "../../../contexts/ApplicationDataContext";
import { useToast } from "../../../contexts/ToastContext";
import { useValidation } from "../../../hooks/useValidation";
import { busValidationSchema } from "../../../schemas/busValidation";

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

const BusMoreInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bus, setBus] = useState<Omit<Bus, "id">>(emptyBus);
  const [loading, setLoading] = useState<boolean>(true);
  const busBackup = useRef<Omit<Bus, "id"> | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const { showToast } = useToast();
  // Use the context to get application data
  const { enums, loading: enumsLoading, error: enumsError } = useApplicationData();

  // Use the validation hook with the bus data and the schema
  const { errors, isFormValid } = useValidation(bus, busValidationSchema);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getBusById(id)
        .then((busData) => {
          if (busData) {
            setBus(busData);
            busBackup.current = busData;
          } else {
            showToast(`No bus found with ID: ${id}`, "error");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch bus details:", err);
          showToast("Failed to fetch bus details. Please try again.", "error");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      showToast("No bus ID provided in the URL.", "error");
      setLoading(false);
    }
  }, [id, showToast]);

  const handleSave = async () => {
    setLoading(true);
    setSubmitted(true);
    if (!isFormValid) {
      showToast("Please correct the form errors.", "error");
      return;
    }

    if (bus === null) {
      setLoading(false);
      showToast(
        "Error! No bus data to save. Please ensure the bus details are loaded correctly.",
        "error"
      );
      return;
    }

    const comparison = compareTwoObjects(bus as Bus, busBackup.current as Bus);

    if (comparison.isMatching) {
      setLoading(false);
      showToast("No changes detected. Bus details were not updated. 🤷", "info");
      return;
    }

    if (comparison.changedLogs.length > 0) {
      console.log("Bus details have been changed. The following updates will be saved:");
      comparison.changedLogs.forEach((log) => {
        console.log(`- Property '${log.key}' changed from '${log.oldValue}' to '${log.newValue}'.`);
      });
    }

    try {
      await updateBus(id as string, bus);
      showToast("Bus details updated successfully!", "success");
      console.log("Bus details updated successfully.");
      busBackup.current = bus;
    } catch (error) {
      console.error("Failed to save bus details:", error);
      showToast("Failed to save changes. Please try again. 😢", "error");
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
          showToast("Bus deleted successfully!", "success");
          window.location.href = "/admin/buses";
        })
        .catch((error) => {
          console.error("Failed to delete bus:", error);
          showToast("Failed to delete bus. Please try again. 😢", "error");
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
  const pageError = enumsError;
  if (pageError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500 font-bold">Error: {pageError}</p>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">No bus data found.</p>
      </div>
    );
  }

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
              readonly={true}
              errorMessage={errors.registrationNumber}
              submitted={submitted}
            />
            {/* Make */}
            <TextInput
              id="make"
              label="Make"
              value={bus.make}
              onChange={handleInputChange}
              errorMessage={errors.make}
              submitted={submitted}
            />
            {/* Model */}
            <TextInput
              id="model"
              label="Model"
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
