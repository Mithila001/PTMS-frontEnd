import type { Driver, Conductor } from "../../types/employee";

interface EmployeeTableProps<T extends Driver | Conductor> {
  employees: T[];
  onViewDetails: (id: number) => void;
}

const EmployeeTable = <T extends Driver | Conductor>({
  employees,
  onViewDetails,
}: EmployeeTableProps<T>) => {
  // Define styles for table headers and cells
  const thStyles =
    "px-5 py-5 border-b-2 border-gray-500 text-left text-xs font-bold text-gray-700 uppercase tracking-wider";
  const tdStyles = "px-5 py-2 border-b border-gray-200 text-sm";
  const isDriverTable = employees.length > 0 && "drivingLicenseNumber" in employees[0];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead className="bg-gray-100">
          <tr>
            <th className={thStyles}>ID</th>
            <th className={thStyles}>NIC Number</th>
            <th className={thStyles}>Name</th>
            <th className={thStyles}>Contact Number</th>
            <th className={thStyles}>Date Joined</th>
            {isDriverTable ? (
              <>
                <th className={thStyles}>Driving License</th>
                <th className={thStyles}>License Class</th>
              </>
            ) : (
              <th className={thStyles}>Conductor License</th>
            )}
            <th className={thStyles}>Available</th>
            <th className={thStyles}></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr
              key={employee.id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition duration-200 ease-in-out`}
            >
              <td className={tdStyles}>{employee.id}</td>
              <td className={tdStyles}>{employee.nicNumber}</td>
              <td className={tdStyles}>{`${employee.firstName} ${employee.lastName}`}</td>
              <td className={tdStyles}>{employee.contactNumber}</td>
              <td className={tdStyles}>{employee.dateJoined}</td>
              {isDriverTable ? (
                <>
                  <td className={tdStyles}>{(employee as Driver).drivingLicenseNumber}</td>
                  <td className={tdStyles}>{(employee as Driver).licenseClass}</td>
                </>
              ) : (
                <td className={tdStyles}>{(employee as Conductor).conductorLicenseNumber}</td>
              )}
              <td className={tdStyles}>
                <span
                  className={`inline-block px-2 py-1 leading-none rounded-full font-semibold uppercase text-xs ${
                    employee.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {employee.available ? "Yes" : "No"}
                </span>
              </td>
              <td className={tdStyles}>
                <button
                  onClick={() => onViewDetails(employee.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-6 rounded-full text-xs"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
