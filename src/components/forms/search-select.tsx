// Search Select Component - Searchable dropdown
"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface SearchSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export function SearchSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  error,
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1" ref={containerRef}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border rounded-lg text-left bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {selectedOption?.label || placeholder}
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border-b focus:outline-none"
              autoFocus
            />
            <div className="max-h-60 overflow-auto">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
