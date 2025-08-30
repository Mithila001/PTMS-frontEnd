import React, { useState } from "react";

type TextInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "password" | "number" | "date" | "tel";
  className?: string;
  readonly?: boolean;
  errorMessage?: string;
  submitted?: boolean;
};

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  value,
  onChange,
  type = "text",
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
    p-2 border rounded-md text-gray-800 focus:outline-none 
    ${showError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"} 
    ${className}
  `;
  return (
    <div className="flex flex-col">
      {/* Container for the label and error message */}
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={id} className="text-gray-600 font-semibold">
          {label}
        </label>
        {/* Render the error message next to the label */}
        {showError && <p className="text-sm text-red-500">{errorMessage}</p>}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        className={inputClasses}
        readOnly={readonly}
      />
    </div>
  );
};

export default TextInput;
