import React from "react";

// Define the shape of a column.
export type Column<T> = {
  header: string;
  key: keyof T | "actions";
  render?: (row: T) => React.ReactNode;
};

// Define the props for our generic DataTable component.
type DataTableProps<T extends object> = {
  data: T[];
  columns: Column<T>[];
};

const DataTable = <T extends object>({ data, columns }: DataTableProps<T>) => {
  // Common Tailwind classes for the table
  const thStyles =
    "px-5 py-5 border-b-2 border-gray-500 text-left text-xs font-bold text-gray-700 uppercase tracking-wider";
  const tdStyles = "px-5 py-2 border-b border-gray-200 text-sm";

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={thStyles}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition duration-200 ease-in-out`}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={tdStyles}>
                  {column.render
                    ? column.render(row)
                    : (row[column.key as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
