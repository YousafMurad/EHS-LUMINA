// Table Filter Component
"use client";

import { useState } from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  key: string;
  label: string;
  options: FilterOption[];
}

interface TableFiltersProps {
  filters: Filter[];
  onFilterChange: (filters: Record<string, string>) => void;
}

export function TableFilters({ filters, onFilterChange }: TableFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    if (!value) delete newFilters[key];
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {filters.map((filter) => (
        <select
          key={filter.key}
          value={activeFilters[filter.key] || ""}
          onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      
      {Object.keys(activeFilters).length > 0 && (
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
