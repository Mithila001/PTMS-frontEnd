// F:\OnGoinProject\Transport Management System\ptms-frontEnd\src\pages/LoginPage.tsx

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/atoms/TextInput";
import PrimaryButton from "../components/atoms/PrimaryButton";
import ErrorAlert from "../components/atoms/ErrorAlert";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  // If the user is already logged in, redirect them away from the login page
  if (isLoggedIn) {
    navigate("/admin");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await login({ username, password });
      navigate("/admin"); // Redirect to the admin dashboard on success
    } catch (err) {
      setError("Login failed. Please check your username and password.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <ErrorAlert errorMessage={error} />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextInput
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PrimaryButton type="submit" disabled={loading} className="w-full">
            {loading ? "Logging In..." : "Login"}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
