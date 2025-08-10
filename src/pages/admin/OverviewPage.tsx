// src/pages/admin/OverviewPage.tsx
import React from "react";

const OverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium opacity-90">Total Buses</h3>
            <p className="text-3xl font-bold mt-2">150</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium opacity-90">Active Routes</h3>
            <p className="text-3xl font-bold mt-2">25</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium opacity-90">Total Drivers</h3>
            <p className="text-3xl font-bold mt-2">80</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium opacity-90">Revenue</h3>
            <p className="text-3xl font-bold mt-2">$45,230</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent activity</h3>
        <p className="text-gray-600">No recent activity — this is example content.</p>
      </section>
    </div>
  );
};

export default OverviewPage;
