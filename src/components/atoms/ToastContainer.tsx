import React, { useEffect, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import type { Toast } from "../../contexts/ToastContext";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

// The individual message box with enhanced animation and styling
const ToastMessage: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDismissing(true);
      setTimeout(() => onDismiss(toast.id), 400); // Slightly longer for smoother exit
    }, 5000); // Dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => onDismiss(toast.id), 400);
  };

  const colorClasses = {
    error: "bg-gradient-to-r from-red-500 to-red-600 border-red-400",
    success: "bg-gradient-to-r from-green-500 to-green-600 border-green-400",
    info: "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400",
  };

  const iconColors = {
    error: "text-red-100",
    success: "text-green-100",
    info: "text-blue-100",
  };

  const animationClasses = `transition-all duration-400 ease-in-out transform ${
    isDismissing ? "translate-x-full opacity-0 scale-95" : "translate-x-0 opacity-100 scale-100"
  }`;

  return (
    <div
      className={`relative w-96 p-5 rounded-xl shadow-2xl text-white my-3 border border-opacity-30 backdrop-blur-sm ${
        colorClasses[toast.type]
      } ${animationClasses}`}
      style={{
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-xl bg-white opacity-5"></div>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 rounded-b-xl transition-all duration-[5000ms] ease-linear"
        style={{
          width: isDismissing ? "0%" : "100%",
          transitionDelay: isDismissing ? "0ms" : "0ms",
        }}
      ></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Type indicator icon */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                iconColors[toast.type]
              } bg-white bg-opacity-20`}
            >
              {toast.type === "error" && <span className="text-xs font-bold">!</span>}
              {toast.type === "success" && <span className="text-xs font-bold">✓</span>}
              {toast.type === "info" && <span className="text-xs font-bold">i</span>}
            </div>
            <span className="font-semibold text-lg tracking-wide">
              {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
            </span>
          </div>

          <button
            onClick={handleDismiss}
            className="ml-4 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-95"
            aria-label="Dismiss notification"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-white text-opacity-95 font-medium">
          {toast.message}
        </p>
      </div>
    </div>
  );
};

// The container for all toast messages with stagger animation
const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end space-y-3 pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: "slideInRight 0.4s ease-out forwards",
          }}
        >
          <ToastMessage toast={toast} onDismiss={removeToast} />
        </div>
      ))}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;
