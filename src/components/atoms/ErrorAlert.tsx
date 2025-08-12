// src/components/atoms/ErrorAlert.tsx

import React from "react";

interface ErrorAlertProps {
  errorMessage: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ errorMessage }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{errorMessage}</span>
      </div>
    </div>
  );
};

export default ErrorAlert;
