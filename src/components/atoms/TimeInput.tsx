import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type TimeInputProps = {
  id: string;
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  readonly?: boolean;
  errorMessage?: string;
  submitted?: boolean;
};

const TimeInput: React.FC<TimeInputProps> = ({
  id,
  label,
  value,
  onChange,
  className = "",
  readonly,
  errorMessage,
  submitted,
}) => {
  const [isTouched, setIsTouched] = useState(false);

  const handleBlur = () => {
    setIsTouched(true);
  };

  const showError = (isTouched || submitted) && errorMessage;

  const inputClasses = `
    p-2 border rounded-md text-gray-800 w-full
    ${showError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}
    ${
      readonly
        ? "bg-gray-100 cursor-default focus:outline-none focus:ring-0"
        : "focus:outline-none focus:ring-2"
    }
    ${className}
  `;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={id} className="text-gray-600 font-semibold">
          {label}
        </label>
        {showError && <p className="text-sm text-red-500">{errorMessage}</p>}
      </div>
      <DatePicker
        id={id}
        selected={value}
        onChange={onChange}
        onBlur={handleBlur}
        readOnly={readonly}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa"
        className={inputClasses}
      />
    </div>
  );
};

export default TimeInput;
