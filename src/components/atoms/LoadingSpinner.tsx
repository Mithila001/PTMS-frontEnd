// src/components/atoms/LoadingSpinner.tsx

import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-950/25">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
        <div
          className="w-16 h-16 border-8 border-gray-200 border-t-indigo-500 rounded-full animate-spin"
          role="status"
        ></div>
        <span className="mt-4 text-black text-lg font-semibold">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
