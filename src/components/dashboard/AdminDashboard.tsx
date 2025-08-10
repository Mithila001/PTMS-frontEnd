// File: src/components/dashboard/AdminDashboard.tsx

import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <a
                href="#"
                className="block p-2 rounded hover:bg-gray-700 transition-colors duration-200"
              >
                Dashboard
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="block p-2 rounded hover:bg-gray-700 transition-colors duration-200"
              >
                Bus Management
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="block p-2 rounded hover:bg-gray-700 transition-colors duration-200"
              >
                Employee Management
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="block p-2 rounded hover:bg-gray-700 transition-colors duration-200"
              >
                Route Management
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock data cards */}
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-2">Total Buses</h3>
            <p className="text-4xl font-bold text-gray-700">150</p>
          </div>
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-2">Active Routes</h3>
            <p className="text-4xl font-bold text-gray-700">75</p>
          </div>
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-2">Total Employees</h3>
            <p className="text-4xl font-bold text-gray-700">300</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
