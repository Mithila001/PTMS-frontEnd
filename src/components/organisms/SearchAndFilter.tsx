// src/components/organisms/SearchAndFilter.tsx

import React from "react";
import SearchBar from "../atoms/SearchBar";
import DropdownFilter from "../molecules/DropdownFilter";

// Defines the props for our SearchAndFilter component.
interface SearchAndFilterProps {
  // Pass the current filter values as props from the parent
  searchTerm: string;
  selectedFilter: string;
  onFilterChange: (filters: { searchTerm: string; selectedFilter: string }) => void;
  filterOptions: string[];
  filterLabel: string;
  showSearchResults?: boolean;
  showDropdownFilter?: boolean;
  searchInputPlaceholder?: string;
  // This is a new optional prop to show search results, which we now
  // get from the parent (which gets them from the hook).
  searchResults?: string[];
  // Loading prop for a loading state in the SearchAndFilter UI
  loading?: boolean;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm, // <-- Now receiving searchTerm from props
  selectedFilter, // <-- Now receiving selectedFilter from props
  onFilterChange,
  filterOptions,
  filterLabel,
  showSearchResults = true,
  showDropdownFilter = true,
  searchInputPlaceholder = "Search...",
  searchResults = [], // <-- Now receiving searchResults from props
  loading = false,
}) => {
  // No local state is needed here anymore!
  // useBusSearch is also removed from this component

  // Function to handle changes in search and filter inputs.
  const handleChanges = (newSearchTerm: string, newSelectedFilter: string) => {
    // This now just passes the values up to the parent
    onFilterChange({ searchTerm: newSearchTerm, selectedFilter: newSelectedFilter });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <div className="flex items-end gap-4">
        <div className="w-full">
          <SearchBar
            searchTerm={searchTerm} // <-- Input value is now from parent props
            onSearchChange={(value) => handleChanges(value, selectedFilter)}
            placeholder={searchInputPlaceholder}
            searchResults={searchResults} // <-- Search results are now from parent props
            onResultClick={(result) => {
              handleChanges(result, selectedFilter);
            }}
            showDropdown={showSearchResults}
          />
        </div>
        {showDropdownFilter && (
          <div className="w-full">
            <DropdownFilter
              options={filterOptions}
              selectedValue={selectedFilter} // <-- Dropdown value is now from parent props
              onValueChange={(value) => handleChanges(searchTerm, value)}
              label={filterLabel}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
