// F:\OnGoinProject\Transport Management System\ptms-frontEnd\src\App.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./components/shared/PrivateRoute";

// Import all your page components
import DashboardPage from "./pages/admin/DashboardPage";
import LoginPage from "./pages/LoginPage";
import BusMoreInfoPage from "./pages/admin/busManagement/BusMoreInfoPage";
import RegisterNewBusPage from "./pages/admin/busManagement/RegisterNewBusPage";
import RouteMoreInfoPage from "./pages/admin/routeManagment/RouteMoreInfoPage";
import AddRoutePage from "./pages/admin/routeManagment/AddRoutePage";
import DriverMoreInfoPage from "./pages/admin/employeeManagement/DriverMoreInfoPage";
import AddEmployeePage from "./pages/admin/employeeManagement/AddEmployeePage";

// Assuming Header and Footer exist
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import { useAuth } from "./contexts/AuthContext";
import LoadingSpinner from "./components/atoms/LoadingSpinner";
import AssignmentMoreInfoPage from "./pages/admin/assignmentManagement/AssignmentMoreInfoPage";
import ScheduledTripsMoreInfoPage from "./pages/admin/scheduleManagement/ScheduledTripsMoreInfoPage";
import AddScheduledTripPage from "./pages/admin/scheduleManagement/AddScheduledTripPage";
import AddAssignmentPage from "./pages/admin/assignmentManagement/AddAssignmentPage";
import ConductorMoreInfoPage from "./pages/admin/employeeManagement/ConductorMoreInfoPage";
import AddUserPage from "./pages/admin/user/AddUserPage";
import UserMoreInfoPage from "./pages/admin/user/UserMoreInfoPage";

function App() {
  const { loading, isLoggedIn } = useAuth(); // Also get isLoggedIn state
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div>
        ) : (
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            {/* If the user is not logged in and tries to access '/', redirect them to login */}
            {!isLoggedIn && <Route path="/" element={<Navigate to="/login" replace />} />}
            {/* Protected admin area mounted under /admin/* */}
            <Route element={<PrivateRoute />}>
              {/* mount dashboard and let DashboardPage handle its own nested routes */}
              <Route path="/admin/*" element={<DashboardPage />} />
              {/* keep specific deep links if needed (optional) */}
              <Route path="/admin/buses/:id" element={<BusMoreInfoPage />} />
              <Route path="/admin/buses/addBus" element={<RegisterNewBusPage />} />
              <Route path="/admin/routes/:id" element={<RouteMoreInfoPage />} />
              <Route path="/admin/routes/addRoutes" element={<AddRoutePage />} />
              <Route
                path="/admin/employeeManagement/driverInfo/:id"
                element={<DriverMoreInfoPage />}
              />
              <Route
                path="/admin/employeeManagement/conductorInfo/:id"
                element={<ConductorMoreInfoPage />}
              />
              <Route path="/admin/employeeManagement/addEmployee" element={<AddEmployeePage />} />
              <Route path="/admin/assignments/moreInfo/:id" element={<AssignmentMoreInfoPage />} />
              <Route
                path="/admin/scheduledTrips/moreInfo/:id"
                element={<ScheduledTripsMoreInfoPage />}
              />
              <Route
                path="/admin/scheduledTrips/addScheduledTrip"
                element={<AddScheduledTripPage />}
              />
              <Route path="/admin/assignments/addAssignment" element={<AddAssignmentPage />} />

              <Route path="/admin/userManagement/addUser" element={<AddUserPage />} />

              <Route path="/admin/userManagement/userInfo/:id" element={<UserMoreInfoPage />} />
            </Route>
            {/* If the user is logged in, redirect root to admin */}
            {isLoggedIn && <Route path="/" element={<Navigate to="/admin" replace />} />}
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
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
