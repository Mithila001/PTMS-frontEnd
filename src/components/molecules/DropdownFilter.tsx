import React from "react";

// Defines the props for our DropdownFilter.
interface DropdownFilterProps {
  options: string[]; // The list of options to display in the dropdown.
  selectedValue: string; // The currently selected value.
  onValueChange: (value: string) => void; // A function to call when an option is selected.
  label: string; // A label for the filter (e.g., "Fuel Type").
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  options,
  selectedValue,
  onValueChange,
  label,
}) => {
  return (
    <div className="relative">
      <label htmlFor={label} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={label}
        value={selectedValue}
        onChange={(e) => onValueChange(e.target.value)}
        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownFilter;
