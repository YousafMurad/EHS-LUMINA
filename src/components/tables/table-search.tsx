// Table Search Component
"use client";

import { useState } from "react";

interface TableSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function TableSearch({ onSearch, placeholder = "Search..." }: TableSearchProps) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>
    </div>
  );
}
