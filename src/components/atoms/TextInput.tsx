import React from "react";

type TextInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "password" | "number" | "date" | "tel";
  className?: string;
  readonly?: boolean;
};

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  className = "",
  readonly,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-gray-600 font-semibold mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none ${className}`}
        readOnly={readonly}
      />
    </div>
  );
};

export default TextInput;
