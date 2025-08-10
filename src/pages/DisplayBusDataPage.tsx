import { useEffect, useState } from "react";
import type { Bus } from "../types/bus";
import { getBuses } from "../api/busService";

const DisplayBusDataPage = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const data = await getBuses();
        setBuses(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Define styles for table headers and cells
  const thStyles =
    "px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider";
  const tdStyles = "px-5 py-5 border-b border-gray-200 text-sm";

  return (
    <div className="container mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Bus Data</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-100">
            <tr>
              <th className={thStyles}>ID</th>
              <th className={thStyles}>Reg No.</th>
              <th className={thStyles}>Make</th>
              <th className={thStyles}>Model</th>
              <th className={thStyles}>Year</th>
              <th className={thStyles}>Fuel Type</th>
              <th className={thStyles}>Seating Capacity</th>
              <th className={thStyles}>NTC Permit Number</th>
              <th className={thStyles}>Bus Type</th>
              <th className={thStyles}>Active</th>
              <th className={thStyles}>A/C</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus, index) => (
              <tr
                key={bus.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition duration-200 ease-in-out`}
              >
                <td className={tdStyles}>{bus.id}</td>
                <td className={tdStyles}>{bus.registrationNumber}</td>
                <td className={tdStyles}>{bus.make}</td>
                <td className={tdStyles}>{bus.model}</td>
                <td className={tdStyles}>{bus.yearOfManufacture}</td>
                <td className={tdStyles}>{bus.fuelType}</td>
                <td className={tdStyles}>{bus.seatingCapacity}</td>
                <td className={tdStyles}>{bus.ntcPermitNumber}</td>
                <td className={tdStyles}>{bus.busType}</td>
                <td className={tdStyles}>{bus.active ? "Yes" : "No"}</td>
                <td className={tdStyles}>{bus.a_C ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayBusDataPage;
