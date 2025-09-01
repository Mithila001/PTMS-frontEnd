import React, { useState } from "react";
import type { Driver, Conductor, Employee, EmployeeType } from "../../../types/employee";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import ErrorAlert from "../../../components/atoms/ErrorAlert";
import TextInput from "../../../components/atoms/TextInput";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import Checkbox from "../../../components/atoms/Checkbox";
import { createConductor } from "../../../api/conductorService";
import { createDriver } from "../../../api/driverService";

// Base empty employee object
const emptyEmployee: Omit<Employee, "id"> = {
  firstName: "",
  lastName: "",
  nicNumber: "",
  dateOfBirth: "",
  contactNumber: "",
  email: "",
  address: "",
  dateJoined: "",
  isCurrentEmployee: true,
  available: true,
};

// Empty driver and conductor objects, including the base employee fields
const emptyDriver: Omit<Driver, "id"> = {
  ...emptyEmployee,
  drivingLicenseNumber: "",
  licenseExpirationDate: "",
  licenseClass: "",
  ntcLicenseNumber: "",
  ntcLicenseExpirationDate: "",
};

const emptyConductor: Omit<Conductor, "id"> = {
  ...emptyEmployee,
  conductorLicenseNumber: "",
  licenseExpirationDate: "",
};

const AddEmployeePage: React.FC = () => {
  const [employeeType, setEmployeeType] = useState<EmployeeType>("driver");
  const [employee, setEmployee] = useState<Omit<Driver, "id"> | Omit<Conductor, "id">>(emptyDriver);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reset the form state when the employee type changes
  const handleTypeChange = (type: EmployeeType) => {
    setEmployeeType(type);
    if (type === "driver") {
      setEmployee(emptyDriver);
    } else if (type === "conductor") {
      setEmployee(emptyConductor);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    // Simple validation for required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "nicNumber",
      "contactNumber",
      "email",
      "address",
    ];
    for (const field of requiredFields) {
      if (!employee[field as keyof typeof employee]) {
        setError(`Please fill out all required fields. Missing: ${field}`);
        setLoading(false);
        return;
      }
    }

    try {
      if (employeeType === "driver") {
        await createDriver(employee as Omit<Driver, "id">);
        alert("Driver created successfully! 👍");
      } else if (employeeType === "conductor") {
        await createConductor(employee as Omit<Conductor, "id">);
        alert("Conductor created successfully! 👍");
      }
      setEmployeeType("driver");
      setEmployee(emptyDriver); // Reset form after successful submission
      console.log("Employee created successfully.");
    } catch (error) {
      console.error("Failed to save employee details:", error);
      setError("Failed to create employee. Please try again. 😢");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;

    setEmployee((prevEmployee) => {
      // Create a temporary state to handle the update
      const updatedEmployee = { ...prevEmployee };

      // Update the specific field based on its type
      if (type === "checkbox") {
        (updatedEmployee as any)[id] = checked;
      } else {
        (updatedEmployee as any)[id] = value;
      }

      return updatedEmployee;
    });
  };

  const renderTypeSpecificFields = () => {
    if (employeeType === "driver") {
      const driver = employee as Omit<Driver, "id">;
      return (
        <>
          <TextInput
            id="drivingLicenseNumber"
            label="Driving License Number"
            value={driver.drivingLicenseNumber}
            onChange={handleInputChange}
          />
          <TextInput
            id="licenseExpirationDate"
            label="License Expiration Date"
            type="date"
            value={driver.licenseExpirationDate}
            onChange={handleInputChange}
          />
          <TextInput
            id="licenseClass"
            label="License Class"
            value={driver.licenseClass}
            onChange={handleInputChange}
          />
          <TextInput
            id="ntcLicenseNumber"
            label="NTC License Number"
            value={driver.ntcLicenseNumber}
            onChange={handleInputChange}
          />
          <TextInput
            id="ntcLicenseExpirationDate"
            label="NTC License Expiration Date"
            type="date"
            value={driver.ntcLicenseExpirationDate}
            onChange={handleInputChange}
          />
        </>
      );
    }
    if (employeeType === "conductor") {
      const conductor = employee as Omit<Conductor, "id">;
      return (
        <>
          <TextInput
            id="conductorLicenseNumber"
            label="Conductor License Number"
            value={conductor.conductorLicenseNumber}
            onChange={handleInputChange}
          />
          <TextInput
            id="licenseExpirationDate"
            label="License Expiration Date"
            type="date"
            value={conductor.licenseExpirationDate}
            onChange={handleInputChange}
          />
        </>
      );
    }
    return null;
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          Register New Employee
        </h1>

        <div className="flex-grow overflow-y-auto">
          {/* Employee Type Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Employee Type
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="employeeType"
                  value="driver"
                  checked={employeeType === "driver"}
                  onChange={() => handleTypeChange("driver")}
                  className="form-radio text-green-600"
                />
                <span className="ml-2 text-gray-700">Driver</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="employeeType"
                  value="conductor"
                  checked={employeeType === "conductor"}
                  onChange={() => handleTypeChange("conductor")}
                  className="form-radio text-green-600"
                />
                <span className="ml-2 text-gray-700">Conductor</span>
              </label>
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Common Employee Fields */}
            <TextInput
              id="firstName"
              label="First Name"
              value={employee.firstName}
              onChange={handleInputChange}
            />
            <TextInput
              id="lastName"
              label="Last Name"
              value={employee.lastName}
              onChange={handleInputChange}
            />
            <TextInput
              id="nicNumber"
              label="NIC Number"
              value={employee.nicNumber}
              onChange={handleInputChange}
            />
            <TextInput
              id="dateOfBirth"
              label="Date of Birth"
              type="date"
              value={employee.dateOfBirth}
              onChange={handleInputChange}
            />
            <TextInput
              id="contactNumber"
              label="Contact Number"
              type="tel"
              value={employee.contactNumber}
              onChange={handleInputChange}
            />
            <TextInput
              id="email"
              label="Email"
              type="email"
              value={employee.email}
              onChange={handleInputChange}
            />
            <div className="md:col-span-2">
              <TextInput
                id="address"
                label="Address"
                value={employee.address}
                onChange={handleInputChange}
              />
            </div>
            <TextInput
              id="dateJoined"
              label="Date Joined"
              type="date"
              value={employee.dateJoined}
              onChange={handleInputChange}
            />

            {/* Render Type-Specific Fields Conditionally */}
            {renderTypeSpecificFields()}

            {/* Is Current Employee & Available */}
            <div className="flex items-center gap-4 mt-2">
              <Checkbox
                id="isCurrentEmployee"
                label="Is Current Employee"
                checked={employee.isCurrentEmployee}
                onChange={handleInputChange}
              />
              <Checkbox
                id="available"
                label="Is Available"
                checked={employee.available}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </div>
        {error && <ErrorAlert errorMessage={error} />}
        <div className="mt-8 pt-4 border-t-2 border-gray-200 flex justify-end space-x-4 h-16 items-center">
          <PrimaryButton
            onClick={handleSave}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Create Employee
          </PrimaryButton>
        </div>
      </div>
      <div className="w-80 bg-gray-200 rounded-lg shadow-xl p-8 flex items-center justify-center text-center">
        <p className="text-gray-500 font-bold">Empty space for future use</p>
      </div>
    </div>
  );
};

export default AddEmployeePage;
