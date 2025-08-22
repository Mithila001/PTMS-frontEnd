// F:\OnGoinProject\Transport Management System\ptms-frontEnd\src\App.tsx

import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./components/shared/PrivateRoute";

// Import all your page components
import DashboardPage from "./pages/admin/DashboardPage";
import LoginPage from "./pages/LoginPage";
import DisplayBusDataPage from "./pages/DisplayBusDataPage";
import BusMoreInfoPage from "./pages/admin/busManagement/BusMoreInfoPage";
import RegisterNewBusPage from "./pages/admin/busManagement/RegisterNewBusPage";
import RouteMoreInfoPage from "./pages/admin/routeManagment/RouteMoreInfoPage";
import AddRoutePage from "./pages/admin/routeManagment/AddRoutePage";
import DriverMoreInfoPage from "./pages/admin/employeeManagement/DriverMoreInfoPage";
import AddEmployeePage from "./pages/admin/employeeManagement/AddEmployeePage";

// Assuming Header and Footer exist
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes - These routes are accessible without authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/showBuses" element={<DisplayBusDataPage />} />

          {/* Protected Routes - Use PrivateRoute as the parent of protected routes */}
          <Route element={<PrivateRoute />}>
            {/* This will now be the default route for authenticated users */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/buses/:id" element={<BusMoreInfoPage />} />
            <Route path="/admin/buses/addBus" element={<RegisterNewBusPage />} />
            <Route path="/admin/routes/:id" element={<RouteMoreInfoPage />} />
            <Route path="/admin/routes/addRoutes" element={<AddRoutePage />} />
            <Route
              path="/admin/employeeManagement/driverInfo/:id"
              element={<DriverMoreInfoPage />}
            />
            <Route path="/admin/employeeManagement/addEmployee" element={<AddEmployeePage />} />
          </Route>

          {/* Fallback for any unmatched routes */}
          <Route
            path="*"
            element={
              <div className="text-center text-gray-900">
                <p>Page not found.</p>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
