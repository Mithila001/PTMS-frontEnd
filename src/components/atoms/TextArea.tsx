// F:\OnGoinProject\Transport Management System\ptms-frontEnd\src\components\atoms\TextArea.tsx

import React from "react";
import type { ChangeEvent } from "react";

interface TextAreaProps {
  label: string;
  id: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, id, value, onChange, className = "" }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="text-gray-600 font-semibold mb-1">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none min-h-[100px]"
      />
    </div>
  );
};

export default TextArea;
