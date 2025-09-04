import React, { useState } from "react";
import SearchBar from "../atoms/SearchBar";
import DropdownFilter from "../molecules/DropdownFilter";
import { useBusSearch } from "../../hooks/search/useBusSearch";

// Defines the props for our SearchAndFilter component.
interface SearchAndFilterProps {
  onFilterChange: (filters: { searchTerm: string; selectedFilter: string }) => void;
  filterOptions: string[]; // The list of options for the dropdown filter.
  filterLabel: string; // The label for the dropdown filter.
  showSearchResults?: boolean; // Optional prop to control search bar dropdown visibility
  showDropdownFilter?: boolean; // control filter dropdown visibility
  searchInputPlaceholder?: string; // Placeholder text for the search input
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onFilterChange,
  filterOptions,
  filterLabel,
  showSearchResults = true,
  showDropdownFilter = true,
  searchInputPlaceholder = "Search...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const { busSearchResults, loading, error } = useBusSearch(searchTerm, selectedFilter);

  const searchResults = busSearchResults.map((bus) => bus.registrationNumber);

  // Function to handle changes in search and filter inputs.
  const handleChanges = (newSearchTerm: string, newSelectedFilter: string) => {
    setSearchTerm(newSearchTerm);
    setSelectedFilter(newSelectedFilter);
    onFilterChange({ searchTerm: newSearchTerm, selectedFilter: newSelectedFilter });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <div className="flex items-end gap-4">
        <div className="w-full">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(value) => handleChanges(value, selectedFilter)}
            placeholder={searchInputPlaceholder}
            searchResults={searchResults}
            onResultClick={(result) => {
              handleChanges(result, selectedFilter);
            }}
            showDropdown={showSearchResults}
          />
        </div>
        {/* Conditionally render the DropdownFilter */}
        {showDropdownFilter && (
          <div className="w-full">
            <DropdownFilter
              options={filterOptions}
              selectedValue={selectedFilter}
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
