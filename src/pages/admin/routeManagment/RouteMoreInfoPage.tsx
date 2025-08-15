import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getRouteById, updateRoute, deleteRoute } from "../../../api/routeService";
import type { Route } from "../../../types/route";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import ErrorAlert from "../../../components/atoms/ErrorAlert";
import { compareTwoObjects } from "../../../utils/compareTwoObjects";
import TextInput from "../../../components/atoms/TextInput";
import TextArea from "../../../components/atoms/TextArea";
import PrimaryButton from "../../../components/atoms/PrimaryButton";

const RouteMoreInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const routeBackup = useRef<Route | null>(null);
  const [routeId, setRouteId] = useState<number | null>(null);

  useEffect(() => {
    console.log("ID:", id);
    if (id) {
      const parsedId = Number(id);
      setRouteId(parsedId);
      if (isNaN(parsedId)) {
        setError("Invalid route ID provided in the URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      getRouteById(parsedId)
        .then((routeData) => {
          if (routeData) {
            setRoute(routeData);
            routeBackup.current = routeData;
            console.log("Route data fetched successfully:", routeData);
          } else {
            setError(`No route found with ID: ${id}`);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch route details:", err);
          setError("Failed to fetch route details. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No route ID provided in the URL.");
      setLoading(false);
    }
  }, [id]);

  const handleSave = async () => {
    if (route === null || routeId === null || isNaN(routeId)) {
      alert("Error: No valid route data or ID to save.");
      return;
    }

    setLoading(true);

    const currentRouteForComparison = {
      ...route,
      majorStops: route.majorStops
        .map((stop: string) => stop.trim())
        .filter((stop) => stop.length > 0),
    };

    const comparison = compareTwoObjects(
      currentRouteForComparison as Route,
      routeBackup.current as Route
    );

    if (comparison.isMatching) {
      setLoading(false);
      alert("No changes detected. Route details were not updated. 🤷");
      return;
    }

    if (comparison.changedLogs.length > 0) {
      console.log("Route details have been changed. The following updates will be saved:");
      comparison.changedLogs.forEach((log) => {
        console.log(`- Property '${log.key}' changed from '${log.oldValue}' to '${log.newValue}'.`);
      });
    }

    try {
      await updateRoute(routeId, route);
      console.log("Route details updated successfully.");
      routeBackup.current = route;
    } catch (error) {
      console.error("Failed to save route details:", error);
      alert("Failed to save changes. Please try again. 😢");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this route? This action cannot be undone."
    );

    if (isConfirmed && routeId !== null && !isNaN(routeId)) {
      deleteRoute(routeId)
        .then(() => {
          window.location.href = "/admin/routes";
        })
        .catch((error) => {
          console.error("Failed to delete route:", error);
          alert("Failed to delete route. Please try again. 😢");
        });
    } else if (isConfirmed && (routeId === null || isNaN(routeId))) {
      alert("Invalid route ID for deletion. 😢");
    } else {
      console.log("Route deletion cancelled.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ErrorAlert errorMessage={error} />
      </div>
    );
  }

  if (!route) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ErrorAlert errorMessage={"No route data found."} />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    setRoute((prevRoute) => {
      if (!prevRoute) return null;

      if (id === "majorStops") {
        return {
          ...prevRoute,
          [id]: value.split("\n"),
        };
      }

      return {
        ...prevRoute,
        [id]: value,
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8">
      {/* Left Column: Form and Buttons */}
      <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          Route Details: {route.routeNumber}
        </h1>

        <div className="flex-grow overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Route Number */}
            <TextInput
              id="routeNumber"
              label="Route Number"
              value={route.routeNumber}
              onChange={handleInputChange}
            />

            <TextInput
              id="origin"
              label="Origin"
              value={route.origin}
              onChange={handleInputChange}
            />

            <TextInput
              id="destination"
              label="Destination"
              value={route.destination}
              onChange={handleInputChange}
            />

            <TextArea
              id="majorStops"
              label="Major Stops (one per line)"
              value={route.majorStops?.join("\n") || ""}
              onChange={handleInputChange}
            />
          </form>
        </div>

        {/* Buttons */}
        <div className="mt-8 pt-4 border-t-2 border-gray-200 flex justify-end space-x-4 h-16 items-center">
          <PrimaryButton
            onClick={handleDelete}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
          >
            Delete
          </PrimaryButton>
          <PrimaryButton
            onClick={handleSave}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Save
          </PrimaryButton>
        </div>
      </div>

      {/* Right Column: Fixed Width Space */}
      <div className="w-80 bg-gray-200 rounded-lg shadow-xl p-8 flex items-center justify-center text-center">
        <p className="text-gray-500 font-bold">Empty space for future use</p>
      </div>
    </div>
  );
};

export default RouteMoreInfoPage;
