import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import HomePage from "./pages/HomePage";
import FormPage from "./pages/FormPage";
import ShowData from "./pages/showData";
import DisplayBusDataPage from "./pages/DisplayBusDataPage";
import DashboardPage from "./pages/admin/DashboardPage";
import BusManagementPage from "./pages/admin/busManagement/BusManagementPage";
import BusMoreInfoPage from "./pages/admin/busManagement/BusMoreInfoPage";
import RegisterNewBusPage from "./pages/admin/busManagement/RegisterNewBusPage";
import RouteMoreInfoPage from "./pages/admin/routeManagment/RouteMoreInfoPage";
import AddRoutePage from "./pages/admin/routeManagment/AddRoutePage";
import DriverMoreInfoPage from "./pages/admin/employeeManagement/DriverMoreInfoPage";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-green-500">
      <Header />

      <main className="flex-grow  bg-amber-400">
        <Routes>
          <Route path="/*" element={<DashboardPage />} />
          <Route path="/showData" element={<ShowData />} />
          <Route path="/pages/FormPage" element={<FormPage />} />
          <Route path="/showBuses" element={<DisplayBusDataPage />} />
          <Route path="/admin/buses/:id" element={<BusMoreInfoPage />} />
          <Route path="/admin/buses/addBus" element={<RegisterNewBusPage />} />
          <Route path="/admin/routes/:id" element={<RouteMoreInfoPage />} />
          <Route path="/admin/routes/addRoutes" element={<AddRoutePage />} />
          <Route path="/admin/busManagement/driverInfo" element={<DriverMoreInfoPage />} />
          {/* Add other routes here */}
          <Route
            path="*"
            element={
              <div className="bg-red-400 text-center text-gray-900">
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
