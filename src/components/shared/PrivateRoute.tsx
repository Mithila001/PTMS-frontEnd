// F:\OnGoinProject\Transport Management System\ptms-frontEnd\src\components\shared\PrivateRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../atoms/LoadingSpinner";

/**
 * A wrapper component that protects routes by checking for user authentication.
 * Redirects to the login page if the user is not logged in.
 */
export const PrivateRoute = () => {
  const { isLoggedIn, loading } = useAuth();

  // Show a loading spinner while we're checking the authentication status
  if (loading) {
    return <LoadingSpinner />;
  }

  // If the user is logged in, render the child route's element
  if (isLoggedIn) {
    return <Outlet />;
  }

  // If not logged in, redirect them to the login page
  return <Navigate to="/login" replace />;
};
