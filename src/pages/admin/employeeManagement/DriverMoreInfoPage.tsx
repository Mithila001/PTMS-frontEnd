import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getRouteById, updateRoute, deleteRoute } from "../../../api/routeService";
import type { Route } from "../../../types/route";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import ErrorAlert from "../../../components/atoms/ErrorAlert";
import { compareTwoObjects } from "../../../utils/compareTwoObjects";
import type { Driver } from "../../../types/employee";
import { deleteDriver, getDriverById, updateDriver } from "../../../api/employeeService";

const DriverMoreInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const driverBackup = useRef<Driver | null>(null);
  const [driverId, setDriverId] = useState<number | null>(null);

  useEffect(() => {
    console.log("ID:", id);
    if (id) {
      const parsedId = Number(id);
      setDriverId(parsedId);
      if (isNaN(parsedId)) {
        setError("Invalid Driver ID provided in the URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      getDriverById(parsedId)
        .then((driverData) => {
          if (driverData) {
            setDriver(driverData);
            driverBackup.current = driverData;
            //console.log("Driver data fetched successfully:", driverData);
          } else {
            setError(`No driver found with ID: ${id}`);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch driver details:", err);
          setError("Failed to fetch driver details. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No driver ID provided in the URL.");
      setLoading(false);
    }
  }, [id]);

  const handleSave = async () => {
    if (driver === null || driverId === null || isNaN(driverId)) {
      alert("Error: No valid driver data or ID to save.");
      return;
    }

    setLoading(true);

    const comparison = compareTwoObjects(driver as Driver, driverBackup.current as Driver);

    if (comparison.isMatching) {
      setLoading(false);
      alert("No changes detected. Driver details were not updated. 🤷");
      return;
    }

    if (comparison.changedLogs.length > 0) {
      console.log("Driver details have been changed. The following updates will be saved:");
      comparison.changedLogs.forEach((log) => {
        console.log(`- Property '${log.key}' changed from '${log.oldValue}' to '${log.newValue}'.`);
      });
    }

    try {
      await updateDriver(driverId, driver);
      console.log("Driver details updated successfully.");
      driverBackup.current = driver;
    } catch (error) {
      console.error("Failed to save driver details:", error);
      alert("Failed to save changes. Please try again. 😢");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this route? This action cannot be undone."
    );

    if (isConfirmed && driverId !== null && !isNaN(driverId)) {
      deleteDriver(driverId)
        .then(() => {
          window.location.href = "/admin/drivers";
        })
        .catch((error) => {
          console.error("Failed to delete driver:", error);
          alert("Failed to delete driver. Please try again. 😢");
        });
    } else if (isConfirmed && (driverId === null || isNaN(driverId))) {
      alert("Invalid driver ID for deletion. 😢");
    } else {
      console.log("Driver deletion cancelled.");
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

  if (!driver) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ErrorAlert errorMessage={"No driver data found."} />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;

    setDriver((prevDriver) => {
      if (!prevDriver) return null;

      return {
        ...prevDriver,
        [id]: type === "checkbox" ? checked : value,
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8">
      {/* Left Column: Form and Buttons */}
      <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          Driver Details: {`${driver.firstName} ${driver.lastName}`}
        </h1>
        <div className="flex-grow overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* First Name */}
            <div className="flex flex-col">
              <label htmlFor="firstName" className="text-gray-600 font-semibold mb-1">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={driver.firstName}
                onChange={handleInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Last Name */}
            <div className="flex flex-col">
              <label htmlFor="lastName" className="text-gray-600 font-semibold mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={driver.lastName}
                onChange={handleInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* NIC Number */}
            <div className="flex flex-col">
              <label htmlFor="nicNumber" className="text-gray-600 font-semibold mb-1">
                NIC Number
              </label>
              <input
                id="nicNumber"
                type="text"
                value={driver.nicNumber}
                onChange={handleInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Date of Birth */}
            <div className="flex flex-col">
              <label htmlFor="dateOfBirth" className="text-gray-600 font-semibold mb-1">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={driver.dateOfBirth}
                onChange={handleInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Contact Number */}
            <div className="flex flex-col">
              <label htmlFor="contactNumber" className="text-gray-600 font-semibold mb-1">
                Contact Number
              </label>
              <input
                id="contactNumber"
                type="tel"
                value={driver.contactNumber}
                onChange={handleInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-600 font-semibold mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={driver.email}
                onChange={handleInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Address */}
            <div className="flex flex-col md:col-span-2">
              <label htmlFor="address" className="text-gray-600 font-semibold mb-1">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={driver.address}
                onChange={handleInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Date Joined */}
            <div className="flex flex-col">
              <label htmlFor="dateJoined" className="text-gray-600 font-semibold mb-1">
                Date Joined
              </label>
              <input
                id="dateJoined"
                type="date"
                value={driver.dateJoined}
                onChange={handleInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Driving License Number */}
            <div className="flex flex-col">
              <label htmlFor="drivingLicenseNumber" className="text-gray-600 font-semibold mb-1">
                Driving License Number
              </label>
              <input
                id="drivingLicenseNumber"
                type="text"
                value={driver.drivingLicenseNumber}
                onChange={handleInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* License Expiration Date */}
            <div className="flex flex-col">
              <label htmlFor="licenseExpirationDate" className="text-gray-600 font-semibold mb-1">
                License Expiration Date
              </label>
              <input
                id="licenseExpirationDate"
                type="date"
                value={driver.licenseExpirationDate}
                onChange={handleInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* License Class */}
            <div className="flex flex-col">
              <label htmlFor="licenseClass" className="text-gray-600 font-semibold mb-1">
                License Class
              </label>
              <input
                id="licenseClass"
                type="text"
                value={driver.licenseClass}
                onChange={handleInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* NTC License Number */}
            <div className="flex flex-col">
              <label htmlFor="ntcLicenseNumber" className="text-gray-600 font-semibold mb-1">
                NTC License Number
              </label>
              <input
                id="ntcLicenseNumber"
                type="text"
                value={driver.ntcLicenseNumber}
                onChange={handleInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* NTC License Expiration Date */}
            <div className="flex flex-col">
              <label
                htmlFor="ntcLicenseExpirationDate"
                className="text-gray-600 font-semibold mb-1"
              >
                NTC License Expiration Date
              </label>
              <input
                id="ntcLicenseExpirationDate"
                type="date"
                value={driver.ntcLicenseExpirationDate}
                onChange={handleInputChange}
                className="bg-gray-50 p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Is Current Employee & Available */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center">
                <input
                  id="isCurrentEmployee"
                  type="checkbox"
                  checked={driver.isCurrentEmployee}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded"
                />
                <label htmlFor="isCurrentEmployee" className="ml-2 text-gray-600 font-semibold">
                  Is Current Employee
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="available"
                  type="checkbox"
                  checked={driver.available}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded"
                />
                <label htmlFor="available" className="ml-2 text-gray-600 font-semibold">
                  Is Available
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Buttons */}
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

      <div className="w-80 bg-gray-200 rounded-lg shadow-xl p-8 flex items-center justify-center text-center">
        <p className="text-gray-500 font-bold">Empty space for future use</p>
      </div>
    </div>
  );
};

export default DriverMoreInfoPage;
