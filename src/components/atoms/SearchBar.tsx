// ptms-frontEnd\src\components\atoms\SearchBar.tsx

import React, { useState } from "react";

/**
 * @description Props for the SearchBar component.
 */
interface SearchBarProps {
  /** The current controlled value of the input field. */
  searchTerm: string;
  /** Callback function to handle changes in the search input. */
  onSearchChange: (searchTerm: string) => void;
  /** Optional text to display when the input is empty. */
  placeholder?: string;
  /** Array of strings to be displayed as search results in the dropdown. */
  searchResults?: string[];
  /** Callback function to handle clicks on a search result item. */
  onResultClick?: (result: string) => void;
}

/**
 * A reusable search bar component with a dynamic dropdown for displaying search results.
 * This component is designed as a controlled component, with its state managed by a parent.
 *
 * @param searchTerm  - The current controlled value of the input field.
 * @param onSearchChange - Callback function to handle changes in the search input.
 * @param placeholder - Optional text to display when the input is empty.
 * @param searchResults - Array of strings to be displayed as search results.
 * @param onResultClick - Callback for when a search result is selected.
 */
const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  searchResults,
  onResultClick,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // The onMouseDown event on the list item is used to handle clicks before the input's onBlur event fires.
  // This prevents the dropdown from closing before the user's click is registered.

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)}
        onBlur={() => {
          // Delay closing the dropdown to allow time for a click event on a result item to fire.
          setTimeout(() => {
            setIsDropdownOpen(false);
          }, 150);
        }}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {isDropdownOpen && searchResults && searchResults.length > 0 && onResultClick && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((result, index) => (
            <li
              key={index}
              onMouseDown={() => {
                onResultClick(result);
                setIsDropdownOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
            >
              {result}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
