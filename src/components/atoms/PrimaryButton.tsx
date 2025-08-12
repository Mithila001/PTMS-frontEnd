import React, { type ButtonHTMLAttributes } from "react";

// Define the props for our PrimaryButton component
interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

// Our functional component for a primary button
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-bold
                py-2
                px-4
                rounded-xl
                focus:outline-none
                focus:shadow-outline
                disabled:bg-gray-400
                disabled:cursor-not-allowed
                ${className}
            `}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
