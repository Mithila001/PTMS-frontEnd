import React, { useState } from "react";
import type { Route } from "../../../types/route";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner";
import ErrorAlert from "../../../components/atoms/ErrorAlert";

const emptyRoute: Omit<Route, "id"> = {
  routeNumber: "",
  origin: "",
  destination: "",
  majorStops: [],
};

const AddRoutePage: React.FC = () => {
  const [route, setRoute] = useState<Omit<Route, "id">>(emptyRoute);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    // Validate that required fields are not empty
    if (!route.routeNumber || !route.origin || !route.destination) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      // The majorStops array needs to be trimmed and filtered to avoid empty strings
      const routeToSave = {
        ...route,
        majorStops: route.majorStops.map((stop) => stop.trim()).filter((stop) => stop.length > 0),
      };

      await addRoute(routeToSave);
      console.log("Route created successfully.");
      alert("Route created successfully! 👍");
      setRoute(emptyRoute); // Reset form after successful submission
    } catch (error) {
      console.error("Failed to save route details:", error);
      setError("Failed to create route. Please try again. 😢");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setRoute((prevRoute) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8">
      <div className="flex flex-col flex-grow bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Register New Route</h1>

        <div className="flex-grow overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Route Number */}
            <div className="flex flex-col">
              <label htmlFor="routeNumber" className="text-gray-600 font-semibold mb-1">
                Route Number
              </label>
              <input
                id="routeNumber"
                type="text"
                value={route.routeNumber}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Origin */}
            <div className="flex flex-col">
              <label htmlFor="origin" className="text-gray-600 font-semibold mb-1">
                Origin
              </label>
              <input
                id="origin"
                type="text"
                value={route.origin}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Destination */}
            <div className="flex flex-col">
              <label htmlFor="destination" className="text-gray-600 font-semibold mb-1">
                Destination
              </label>
              <input
                id="destination"
                type="text"
                value={route.destination}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              />
            </div>
            {/* Major Stops */}
            <div className="flex flex-col md:col-span-2">
              <label htmlFor="majorStops" className="text-gray-600 font-semibold mb-1">
                Major Stops (one per line)
              </label>
              <textarea
                id="majorStops"
                value={route.majorStops?.join("\n") || ""}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none min-h-[100px]"
              />
            </div>
          </form>
        </div>
        {error && <ErrorAlert errorMessage={error} />}
        <div className="mt-8 pt-4 border-t-2 border-gray-200 flex justify-end space-x-4 h-16 items-center">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Create Route
          </button>
        </div>
      </div>
      <div className="w-80 bg-gray-200 rounded-lg shadow-xl p-8 flex items-center justify-center text-center">
        <p className="text-gray-500 font-bold">Empty space for future use</p>
      </div>
    </div>
  );
};

export default AddRoutePage;
function addRoute(routeToSave: {
  majorStops: string[];
  routeNumber: string;
  origin: string;
  destination: string;
}) {
  throw new Error("Function not implemented.");
}
