import React, { useState } from "react";

// Defines the props that our SearchBar component will accept.
interface SearchBarProps {
  searchTerm: string; // The current value of the search input.
  onSearchChange: (searchTerm: string) => void; // Callback function to handle changes in the search input.
  placeholder?: string; // Optional text to display when the input is empty.
  searchResults?: string[]; // A new prop to pass the search results to the component.
  onResultClick?: (result: string) => void; // A new prop to handle clicks on a result item.
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  searchResults,
  onResultClick,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // A brief explanation of the onMouseDown event:
  // The onMouseDown event fires before the onBlur event on the input.
  // This ensures that our click handler is always called before the dropdown disappears.

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)}
        onBlur={() => {
          // Delay closing the dropdown to allow for a click on a list item.
          setTimeout(() => {
            setIsDropdownOpen(false);
          }, 150); // Increased the timeout slightly for better reliability.
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

      {/* Conditionally render the dropdown list */}
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
