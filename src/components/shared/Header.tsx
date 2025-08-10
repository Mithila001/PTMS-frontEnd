// src/components/shared/Header.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { XMarkIcon, Bars4Icon } from "@heroicons/react/24/solid";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/showData", label: "Show Data" },
    { to: "/pages/FormPage", label: "Form Page" },
    { to: "/showBuses", label: "Bus Data" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Bus Transport Management System
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-2 py-1 font-medium ${
                pathname === link.to
                  ? "text-blue-600 after:content-[''] after:block after:w-full after:h-0.5 after:bg-blue-600 after:absolute after:-bottom-1 after:left-0"
                  : "text-gray-700 hover:text-blue-500"
              }
              `}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-800" />
          ) : (
            <Bars4Icon className="h-6 w-6 text-gray-800" />
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <nav className="md:hidden bg-white border-t">
          <ul className="flex flex-col space-y-1 py-2 px-4">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block px-2 py-2 rounded-md ${
                    pathname === link.to
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
