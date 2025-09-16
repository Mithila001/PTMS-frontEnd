// src/pages/admin/OverviewPage.tsx
import React, { useState, useEffect } from "react";
import { getDashboardMetrics } from "../../api/dashboardService"; // Correct path to your API file
import type { DashboardMetrics } from "../../types/dashboard";

// Component to represent a single metric card
interface MetricCardProps {
  title: string;
  value: number | string | undefined;
  gradient: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, gradient }) => (
  <div
    className={`p-6 rounded-lg shadow-xl text-white transform transition-transform duration-300 hover:scale-105 ${gradient}`}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-4xl font-extrabold">{value}</p>
  </div>
);

const OverviewPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        setError("Failed to fetch dashboard metrics.");
        console.error("Error fetching dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-200 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <MetricCard
          title="Total Active Buses"
          value={metrics?.totalActiveBuses}
          gradient="bg-gradient-to-r from-blue-500 to-blue-700"
        />
        <MetricCard
          title="Total Routes"
          value={metrics?.totalRoutes}
          gradient="bg-gradient-to-r from-green-500 to-green-700"
        />
        <MetricCard
          title="Total Active Drivers"
          value={metrics?.totalActiveDrivers}
          gradient="bg-gradient-to-r from-purple-500 to-purple-700"
        />
        <MetricCard
          title="Total Active Conductors"
          value={metrics?.totalActiveConductors}
          gradient="bg-gradient-to-r from-orange-500 to-orange-700"
        />
        <MetricCard
          title="Scheduled Trips"
          value={metrics?.totalScheduledTrips}
          gradient="bg-gradient-to-r from-red-500 to-red-700"
        />
        <MetricCard
          title="Active Assignments"
          value={metrics?.totalActiveAssignments}
          gradient="bg-gradient-to-r from-teal-500 to-teal-700"
        />
      </div>
    </div>
  );
};

export default OverviewPage;
