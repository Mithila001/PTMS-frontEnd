import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// Define the shape of a single toast message
export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

// Define the shape of the context's value
interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

// Create the context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// A custom hook to use the context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// The provider component that will manage the toast state
interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast["type"]) => {
    // Check if a toast with the same message already exists
    const isDuplicate = toasts.some((toast) => toast.message === message);
    if (isDuplicate) {
      return; // Do not add the same toast again
    }
    // We use a timestamp for a unique ID
    const id = Date.now().toString();
    const newToast = { id, message, type };
    setToasts((prevToasts) => [...prevToasts, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
