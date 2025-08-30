// src/components/atoms/Dropdown.tsx
import React, { useState } from "react";

interface DropdownProps {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  errorMessage?: string;
  submitted?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  errorMessage,
  submitted,
}) => {
  const [isTouched, setIsTouched] = useState(false);

  const handleBlur = () => {
    setIsTouched(true);
  };

  const showError = (isTouched || submitted) && errorMessage;

  const selectClasses = `
    w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm
    ${
      showError
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
    }
  `;

  return (
    <div className="flex flex-col space-y-1">
      {/* Container for the label and error message */}
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {/* Render the error message next to the label */}
        {showError && <p className="text-sm text-red-500">{errorMessage}</p>}
      </div>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        className={selectClasses}
      >
        <option value="" disabled>
          Select a {label.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
