// src/components/atoms/LoadingSpinner.tsx

import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-blue-400">
      <div className="flex flex-col items-center">
        <div
          className="w-16 h-16 border-8 border-gray-200 border-t-indigo-500 rounded-full animate-spin"
          role="status"
        ></div>
        <span className="mt-4 text-white text-lg font-semibold">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
