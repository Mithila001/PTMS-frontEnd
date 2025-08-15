// ptms-frontEnd\src\components\atoms\Checkbox.tsx

import React from "react";

type CheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange, className = "" }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      <label htmlFor={id} className="text-gray-600 font-semibold">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
