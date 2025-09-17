// src/pages/admin/user/UserManagementPage.tsx

import React, { useState, useEffect } from "react";
import SearchAndFilter from "../../../components/organisms/SearchAndFilter";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import type { UserResponse } from "../../../types/user";
import type { Column } from "../../../components/molecules/DataTable";
import DataTable from "../../../components/molecules/DataTable";
import { getAllUsers } from "../../../api/userService";
import { useToast } from "../../../contexts/ToastContext";

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);
  const [filters, setFilters] = useState({ searchTerm: "", selectedFilter: "" });

  const { showToast } = useToast(); // Brief Explanation: This effect fetches all user data from the API as soon as the page loads. It handles success and error cases, showing a toast message if fetching fails.

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (e: unknown) {
        if (e instanceof Error) {
          showToast(`Error: ${e.message}`, "error");
        } else {
          showToast("An unknown error occurred while fetching users", "error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Brief Explanation: This effect filters the list of users whenever the main user list or the search filters change.

  useEffect(() => {
    let newFilteredUsers = users.filter((user) => {
      const matchesSearchTerm = user.username
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
      return matchesSearchTerm;
    });

    setFilteredUsers(newFilteredUsers);
  }, [users, filters]);

  const handleAddUser = () => {
    // Brief Explanation: This function handles the "Add User" button click, navigating the user to a new page to add a user.
    window.location.href = "/admin/userManagement/addUser";
  };

  const handleViewUser = (id: number) => {
    // Brief Explanation: This function handles the "View" button click for a specific user, navigating to a details page.
    window.location.href = `/admin/userManagement/userInfo/${id}`;
  };

  const commonHeaderStyles =
    "flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-2 bg-white border rounded-lg shadow-sm mb-6";
  const titleStyles = "text-3xl font-bold text-gray-800";
  const subtitleStyles = "text-gray-600 mt-1";
  const actionContainerStyles = "flex flex-col sm:flex-row items-stretch sm:items-center gap-3";
  const contentContainerStyles = "bg-white p-4 rounded-lg shadow-sm border";

  if (loading) {
    return <LoadingSpinner />;
  }

  const userColumns: Column<UserResponse>[] = [
    { header: "ID", key: "id" },
    { header: "Username", key: "username" },
    { header: "First Name", key: "firstName" },
    { header: "Last Name", key: "lastName" },
    { header: "NIC", key: "nic" },
    {
      header: "Roles",
      key: "roles",
      render: (user) => (user.roles ? user.roles.join(", ") : "N/A"),
    },
    {
      header: "Actions",
      key: "actions",
      render: (user) => (
        <button
          onClick={() => handleViewUser(user.id)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-6 rounded-full text-xs"
        >
          View{" "}
        </button>
      ),
    },
  ];

  return (
    <div className="container mx-auto mt-2 p-2 bg-white">
      {/* Page Header */}
      <div className={commonHeaderStyles}>
        <div>
          <h1 className={titleStyles}>User Management</h1>{" "}
          <p className={subtitleStyles}>Manage and view user data</p>
        </div>

        <div className={actionContainerStyles}>
          <SearchAndFilter
            onFilterChange={(filters) => setFilters(filters)}
            filterOptions={[]}
            filterLabel="Filter By"
            showSearchResults={false}
            showDropdownFilter={false}
            searchInputPlaceholder="Search by username"
            searchTerm={filters.searchTerm}
            selectedFilter={filters.selectedFilter}
          />
          <PrimaryButton onClick={handleAddUser}>Add User</PrimaryButton>
        </div>
      </div>
      {/* Content Section */}
      <div className={contentContainerStyles}>
        <DataTable data={filteredUsers} columns={userColumns} />
      </div>
    </div>
  );
};

export default UserManagementPage;
