// File: src/pages/admin/user/UserMoreInfoPage.tsx

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import TextInput from "../../../components/atoms/TextInput";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import Dropdown from "../../../components/atoms/Dropdown";
import { useToast } from "../../../contexts/ToastContext";
import { useApplicationData } from "../../../contexts/ApplicationDataContext";
import { compareTwoObjects } from "../../../utils/compareTwoObjects";
import { getUserById, updateUser, deleteUserById } from "../../../api/userService";
import type { UserResponse } from "../../../types/user";
import { useValidation } from "../../../hooks/useValidation";
import { userValidationSchema } from "../../../schemas/userValidation";

const emptyUser: Omit<UserResponse, "id"> = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  nic: "",
  roles: [],
};

const UserMoreInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const userBackup = useRef<UserResponse | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const { showToast } = useToast();
  const { enums, loading: enumsLoading, error: enumsError } = useApplicationData();

  // Use the validation hook with the user data and the schema
  const { errors, isFormValid } = useValidation(user || emptyUser, userValidationSchema);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getUserById(id as string)
        .then((userData) => {
          if (userData) {
            setUser(userData);
            userBackup.current = userData;
          } else {
            showToast(`No user found with ID: ${id}`, "error");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user details:", err);
          showToast("Failed to fetch user details. Please try again.", "error");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      showToast("No user ID provided in the URL.", "error");
      setLoading(false);
    }
  }, [id, showToast]);

  const handleSave = async () => {
    setSubmitted(true);
    if (!isFormValid) {
      showToast("Please correct the form errors.", "error");
      return;
    }

    if (user === null) {
      showToast(
        "Error! No user data to save. Please ensure the user details are loaded correctly.",
        "error"
      );
      return;
    }

    const comparison = compareTwoObjects(user, userBackup.current as UserResponse);

    if (comparison.isMatching) {
      showToast("No changes detected. User details were not updated. 🤷", "info");
      return;
    }

    console.log("User details have been changed. The following updates will be saved:");
    comparison.changedLogs.forEach((log) => {
      console.log(`- Property '${log.key}' changed from '${log.oldValue}' to '${log.newValue}'.`);
    });

    setLoading(true);
    try {
      await updateUser(id as string, user);
      showToast("User details updated successfully!", "success");
      console.log("User details updated successfully.");
      userBackup.current = user;
    } catch (error) {
      console.error("Failed to save user details:", error);
      showToast("Failed to save changes. Please try again. 😢", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );

    if (isConfirmed) {
      deleteUserById(id as string)
        .then(() => {
          showToast("User deleted successfully!", "success");
          window.location.href = "/admin/user";
        })
        .catch((error) => {
          console.error("Failed to delete user:", error);
          showToast("Failed to delete user. Please try again. 😢", "error");
        });
    } else {
      console.log("User deletion cancelled.");
    }
  };

  const isLoading = loading || enumsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  const pageError = enumsError;
  if (pageError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500 font-bold">Error: {pageError}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">No user data found.</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        [id]: value,
      };
    });
  };

  const handleDropdownChange = (value: string) => {
    // Brief Explanation: This function updates the roles state when a new role is selected from the dropdown.
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        roles: [value],
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8">
      {/* Left Column: Form and Buttons */}
      <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          User Details: {user.firstName} {user.lastName}
        </h1>

        <div className="flex-grow overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* User Name (Read-only) */}
            <TextInput
              id="username"
              label="Username"
              value={user.username}
              onChange={handleInputChange}
              readonly={true}
              errorMessage={errors.username}
              submitted={submitted}
            />
            {/* First Name */}
            <TextInput
              id="firstName"
              label="First Name"
              value={user.firstName}
              onChange={handleInputChange}
              errorMessage={errors.firstName}
              submitted={submitted}
            />
            {/* Last Name */}
            <TextInput
              id="lastName"
              label="Last Name"
              value={user.lastName}
              onChange={handleInputChange}
              errorMessage={errors.lastName}
              submitted={submitted}
            />
            {/* Email */}
            <TextInput
              id="email"
              label="Email"
              value={user.email}
              onChange={handleInputChange}
              errorMessage={errors.email}
              submitted={submitted}
            />
            {/* NIC */}
            <TextInput
              id="nic"
              label="NIC Number"
              value={user.nic}
              onChange={handleInputChange}
              errorMessage={errors.nic}
              submitted={submitted}
            />
            {/* Role Selection */}
            <Dropdown
              id="roles"
              label="User Role"
              options={enums.userRoles}
              value={user.roles[0] || ""}
              onChange={(e) => handleDropdownChange(e.target.value)}
              errorMessage={errors.roles}
              submitted={submitted}
            />
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

export default UserMoreInfoPage;
