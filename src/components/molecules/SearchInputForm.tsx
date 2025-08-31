import React, { useState } from "react";
import SearchBar from "../atoms/SearchBar";

interface SearchInputFormProps {
  id: string; // The ID for the input field.
  label: string; // The label text to display above the input.
  searchTerm: string; // The current value of the search input.
  onSearchChange: (searchTerm: string) => void; // Callback for when the search term changes.
  placeholder?: string; // Optional placeholder text.
  searchResults: string[]; // An array of search result strings.
  onResultClick: (result: string) => void; // Callback for when a result is clicked.
  errorMessage?: string; // Optional error message to display.
  submitted?: boolean; // A boolean to indicate if the form has been submitted.
}

const SearchInputForm: React.FC<SearchInputFormProps> = ({
  id,
  label,
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  searchResults,
  onResultClick,
  errorMessage,
  submitted,
}) => {
  const [isTouched, setIsTouched] = useState(false);

  // A brief explanation of the handleBlur function:
  // When the input loses focus (the user clicks away), this function marks the input as "touched."
  // This helps us decide when to show validation errors—usually only after the user has interacted with the field.
  const handleBlur = () => {
    setIsTouched(true);
  };

  // Check if we should show an error message.
  const showError = (isTouched || submitted) && errorMessage;

  return (
    <div className="flex flex-col">
      {/* Container for the label and error message */}
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={id} className="text-gray-600 font-semibold">
          {label}
        </label>
        {/* Render the error message next to the label */}
        {showError && <p className="text-sm text-red-500">{errorMessage}</p>}
      </div>
      {/* The main search bar component */}
      <div onBlur={handleBlur} tabIndex={0}>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          placeholder={placeholder}
          searchResults={searchResults}
          onResultClick={(result) => {
            onResultClick(result);
            setIsTouched(true); // Mark as touched when a result is selected
          }}
        />
      </div>
    </div>
  );
};

export default SearchInputForm;
