// F:\OnGoinProject\Transport Management System\ptms-frontEnd\src\components\shared\Sidebar.tsx

import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

// Define the full menu
const fullMenu = [
  { to: "overview", label: "Overview", icon: "📊" },
  { to: "buses", label: "Buses", icon: "🚌" },
  { to: "employees", label: "Employees", icon: "👩‍✈️" },
  { to: "routes", label: "Routes", icon: "🗺️" },
  { to: "logs", label: "Logs", icon: "📝" },
  { to: "assignments", label: "Assignments", icon: "🗂️" },
  { to: "scheduled-trips", label: "Scheduled Trips", icon: "📅" },
  { to: "user", label: "User Management", icon: "👤" },
];

// Define the menu for a standard user
const userMenu = [
  { to: "buses", label: "Buses", icon: "🚌" },
  { to: "routes", label: "Routes", icon: "🗺️" },
];

const operationsManagerMenu = [
  { to: "overview", label: "Overview", icon: "📊" },
  { to: "buses", label: "Buses", icon: "🚌" },
  { to: "employees", label: "Employees", icon: "👩‍✈️" },
  { to: "routes", label: "Routes", icon: "🗺️" },
  { to: "assignments", label: "Assignments", icon: "🗂️" },
  { to: "scheduled-trips", label: "Scheduled Trips", icon: "📅" },
];

const Sidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  // Get the highest role from the auth context
  const { highestRole, logout: clientLogout } = useAuth();
  console.log("Highest Role:", highestRole); // Debugging line

  // Determine which menu to display based on the user's role
  const menuToDisplay = (() => {
    switch (highestRole) {
      case "ROLE_ADMIN":
        return fullMenu;
      case "ROLE_OPERATIONS_MANAGER":
        return operationsManagerMenu;
      case "ROLE_USER":
      default:
        return userMenu;
    }
  })();

  const handleLogout = async () => {
    try {
      // 1. Call the logout function from AuthContext (which hits the backend and clears state)
      await clientLogout();
      window.location.replace("/login");
    } catch (error) {
      console.error("Failed to process logout:", error);
      window.location.replace("/login");
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`fixed z-40 left-0 top-0 h-full w-64 bg-slate-800 text-white transform transition-transform md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        aria-label="Main navigation"
      >
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="text-lg font-bold">Transport MS</div>
          {/* close button on mobile */}
          <button
            onClick={onClose}
            className="md:hidden text-slate-300 hover:text-white"
            aria-label="Close menu"
          >
            ✖
          </button>
        </div>

        <nav className="py-4 flex-1 overflow-auto" aria-label="Sidebar">
          {menuToDisplay.map((m) => (
            <NavLink
              key={m.to}
              to={m.to === "overview" ? "/admin" : `/admin/${m.to}`}
              // Add the 'end' prop to the "Overview" NavLink
              end={m.to === "overview"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-left transition ${
                  isActive
                    ? "bg-blue-600 text-white border-r-4 border-blue-400"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{m.icon}</span>
              <span className="font-medium">{m.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-700">
          <button
            type="button"
            className="w-full px-4 py-3 flex items-center gap-3 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200 rounded-lg"
            onClick={() => {
              handleLogout();
            }}
          >
            <span className="text-lg">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Push content to the right on md+ */}
      <div className="hidden md:block w-64 flex-shrink-0" aria-hidden />
    </>
  );
};

export default Sidebar;
