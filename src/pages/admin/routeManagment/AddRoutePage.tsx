// src/pages/admin/routeManagment/AddRoutePage.tsx

import React, { useState } from "react";
import { createRoute } from "../../../api/routeService";
import type { Route } from "../../../types/route";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import TextInput from "../../../components/atoms/TextInput";
import TextArea from "../../../components/atoms/TextArea";
import PrimaryButton from "../../../components/atoms/PrimaryButton";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import L from "leaflet";
import { parseWKTLineString } from "../../../utils/wktParser";
import { useToast } from "../../../contexts/ToastContext";

// An empty object representing a new route
const emptyRoute: Omit<Route, "id"> = {
  routeNumber: "",
  origin: "",
  destination: "",
  majorStops: [],
  routePath: "",
};

const AddRoutePage: React.FC = () => {
  const [route, setRoute] = useState<Omit<Route, "id">>(emptyRoute);
  const [loading, setLoading] = useState<boolean>(false);
  const [routePath, setRoutePath] = useState<L.LatLngExpression[]>([]);
  const defaultCenter: L.LatLngExpression = [6.926591, 79.838035];

  const { showToast } = useToast();

  // This function updates the component's state as the user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    setRoute((prevRoute) => {
      // Handles the special case of 'majorStops' which is an array
      if (id === "majorStops") {
        return {
          ...prevRoute,
          [id]: value.split("\n"),
        };
      }

      // Updates the state for all other text inputs
      return {
        ...prevRoute,
        [id]: value,
      };
    });
  };

  // This function is triggered when the route path is updated in the form
  const handleRoutePathChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    handleInputChange(e); // Update the state of the route object

    const [parsedPath, isValid] = parseWKTLineString(value);

    if (isValid) {
      setRoutePath(parsedPath);
    } else {
      showToast("Invalid WKT format. Please ensure it is a valid LINESTRING.", "error");
    }
  };

  const handleSave = async () => {
    setLoading(true);

    // Basic validation to ensure required fields are not empty
    if (!route.routeNumber || !route.origin || !route.destination || !route.routePath) {
      showToast("Please fill out all required fields.", "error");
      setLoading(false);
      return;
    }

    try {
      await createRoute(route);
      showToast("Route created successfully!", "success");
      setRoute(emptyRoute); // Reset the form after successful creation
      //setRoutePath([]); // Reset the map
      console.log("Route created successfully.");
    } catch (error) {
      console.error("Failed to save route:", error);
      showToast("Failed to create route. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8 z-0">
      {/* Left Column: Form and Buttons */}
      <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Register New Route</h1>
        <div className="flex-grow overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
              value={route.majorStops.join("\n")}
              onChange={handleInputChange}
            />
            <TextArea
              id="routePath"
              label="Route Path (WKT)"
              value={route.routePath || ""}
              onChange={handleRoutePathChange}
              className="col-span-1 md:col-span-2"
            />
          </form>
        </div>
        {/* Buttons */}
        <div className="mt-8 pt-4 border-t-2 border-gray-200 flex justify-end space-x-4 h-16 items-center">
          <PrimaryButton
            onClick={handleSave}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Create Route
          </PrimaryButton>
        </div>
      </div>
      {/* Right Column: Map */}
      <div className="flex-grow flex flex-col bg-white rounded-lg shadow-xl p-8 z-0">
        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Route Map Preview</h2>
        <div
          className="flex-grow rounded-md overflow-hidden"
          style={{ height: "100%", width: "100%" }}
        >
          <MapContainer
            center={routePath.length > 0 ? routePath[0] : defaultCenter}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            key={routePath.length > 0 ? "map-with-path" : "map-without-path"}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {routePath.length > 0 && <Polyline positions={routePath} color="red" />}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default AddRoutePage;
