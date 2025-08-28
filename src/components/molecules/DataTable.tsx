import React, { useState } from "react";

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
  // New optional prop for columns that require line breaks.
  columnsWithLineBreaks?: (keyof T | "actions")[];
};

const DataTable = <T extends object>({
  data,
  columns,
  columnsWithLineBreaks = [],
}: DataTableProps<T>) => {
  // State for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  // Common Tailwind classes for the table
  const thStyles =
    "px-5 py-5 border-b-2 border-gray-500 text-left text-xs font-bold text-gray-700 uppercase tracking-wider";
  const tdStyles = "px-5 py-2 border-b border-gray-200 text-sm";

  // This function will sort the data based on our sort state.
  const sortedData = React.useMemo(() => {
    let sortableData = [...data]; // Create a copy of the data to avoid mutating the original prop
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // Function to handle header clicks and update sort state.
  const handleSort = (key: keyof T | "actions") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: key as keyof T, direction });
  };

  // Function to determine the sorting icon.
  const getSortIcon = (key: keyof T | "actions") => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`${thStyles} cursor-pointer`}
                onClick={() => handleSort(column.key)}
              >
                <div className="flex items-center">
                  <span>{column.header}</span>
                  <span className="ml-2">{getSortIcon(column.key)}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition duration-200 ease-in-out`}
            >
              {columns.map((column, colIndex) => {
                const value = row[column.key as keyof T] as React.ReactNode;
                const shouldBreakLines = columnsWithLineBreaks.includes(column.key);

                if (shouldBreakLines && typeof value === "string") {
                  const lines = value.split("\n");
                  return (
                    <td key={colIndex} className={`${tdStyles} whitespace-pre-wrap`}>
                      {lines.map((line, lineIndex) => (
                        <p key={lineIndex}>{line}</p>
                      ))}
                    </td>
                  );
                }

                return (
                  <td key={colIndex} className={tdStyles}>
                    {column.render ? column.render(row) : (value as React.ReactNode)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
