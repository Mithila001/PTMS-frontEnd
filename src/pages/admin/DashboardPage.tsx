// src/pages/admin/DashboardPage.tsx
import React, { Suspense, lazy, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../../components/shared/Sidebar";

const OverviewPage = lazy(() => import("./OverviewPage"));
const BusManagementPage = lazy(() => import("./BusManagementPage"));
const DriversPage = lazy(() => import("./DriversPage"));
const RoutesPage = lazy(() => import("./RoutesPage"));
const ReportsPage = lazy(() => import("./ReportsPage"));
const SettingsPage = lazy(() => import("./SettingsPage"));

const LoadingFallback: React.FC = () => (
  <div className="p-8">
    <div className="text-gray-600">Loading...</div>
  </div>
);

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route index element={<OverviewPage />} />
              <Route path="admin/overview" element={<OverviewPage />} />
              <Route path="admin/buses" element={<BusManagementPage />} />
              <Route path="admin/drivers" element={<DriversPage />} />
              <Route path="admin/routes" element={<RoutesPage />} />
              <Route path="admin/reports" element={<ReportsPage />} />
              <Route path="admin/settings" element={<SettingsPage />} />

              {/* Redirect old root /admin to overview */}
              <Route path="*" element={<Navigate to="overview" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
