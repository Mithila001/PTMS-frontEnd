// src/pages/admin/user/AddUserPage.tsx

import React, { useState } from "react";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import TextInput from "../../../components/atoms/TextInput";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import Dropdown from "../../../components/atoms/Dropdown";
import type { NewUser, RegisteredUserResponse } from "../../../types/user";
import { useToast } from "../../../contexts/ToastContext";
import { createUser } from "../../../api/userService";
import { useApplicationData } from "../../../contexts/ApplicationDataContext";
// import { createUser } from "../../../api/userService"; // We'll add this next.

// Brief Explanation: This is the base state for a new user, initialized with empty strings for form fields.
const emptyNewUser = {
  firstName: "",
  lastName: "",
  email: "",
  nic: "",
  roles: [],
};

const AddUserPage: React.FC = () => {
  const [newUser, setNewUser] = useState<NewUser>(emptyNewUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [registeredUser, setRegisteredUser] = useState<RegisteredUserResponse | null>(null);
  const { showToast } = useToast();
  const { enums } = useApplicationData();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleDropdownChange = (value: string) => {
    // Brief Explanation: This function updates the roles state when a new role is selected from the dropdown.
    setNewUser((prevState) => ({
      ...prevState,
      roles: [value], // Assuming only one role can be selected for now.
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const requiredFields = ["firstName", "lastName", "email", "nic"];
    for (const field of requiredFields) {
      if (!newUser[field as keyof NewUser]) {
        showToast(`Please fill out all required fields. Missing: ${field}`, "error");
        setLoading(false);
        return;
      }
    }

    if (newUser.roles.length === 0) {
      showToast("Please select a role for the user.", "error");
      setLoading(false);
      return;
    }

    try {
      const createdUser = await createUser(newUser);
      showToast("User created successfully!", "success");
      setRegisteredUser(createdUser);
      setNewUser(emptyNewUser); // Reset form after successful submission
    } catch (error) {
      console.error("Failed to save user details:", error);
      showToast("Failed to create user. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (registeredUser) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex space-x-8">
        <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
            User Created Successfully! 🎉
          </h1>
          <div className="text-gray-700 flex-grow">
            <p className="mb-4">
              The new user's account has been successfully created. Please provide them with the
              following credentials:
            </p>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="font-semibold">
                Username: <span className="text-green-600">{registeredUser.username}</span>
              </p>
              <p className="font-semibold">
                Password: <span className="text-green-600">{registeredUser.password}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8">
      <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Register New User</h1>

        <div className="flex-grow overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Common User Fields */}
            <TextInput
              id="firstName"
              label="First Name"
              value={newUser.firstName}
              onChange={handleInputChange}
            />
            <TextInput
              id="lastName"
              label="Last Name"
              value={newUser.lastName}
              onChange={handleInputChange}
            />
            <TextInput
              id="email"
              label="Email"
              type="email"
              value={newUser.email}
              onChange={handleInputChange}
            />
            <TextInput
              id="nic"
              label="NIC Number"
              value={newUser.nic}
              onChange={handleInputChange}
            />
            {/* Role Selection */}
            <Dropdown
              id="roles"
              label="Select User Role"
              options={enums.userRoles}
              value={newUser.roles[0] || ""}
              onChange={(e) => handleDropdownChange(e.target.value)}
            />
          </form>
        </div>
        <div className="mt-8 pt-4 border-t-2 border-gray-200 flex justify-end space-x-4 h-16 items-center">
          <PrimaryButton onClick={handleSave}>Create User</PrimaryButton>
        </div>
      </div>
      <div className="w-80 bg-gray-200 rounded-lg shadow-xl p-8 flex items-center justify-center text-center">
        <p className="text-gray-500 font-bold">Empty space for future use</p>
      </div>
    </div>
  );
};

export default AddUserPage;
