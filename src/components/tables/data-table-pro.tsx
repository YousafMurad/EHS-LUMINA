// Professional Data Table Component
"use client";

import { ReactNode, useState } from "react";
import { ChevronUp, ChevronDown, MoreVertical, Search, Filter, Download } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  actions?: (row: T) => ReactNode;
  bulkActions?: ReactNode;
  selectedRows?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
}

export function DataTablePro<T extends { id: string | number }>({
  data,
  columns,
  loading,
  emptyMessage = "No data found",
  emptyIcon,
  onRowClick,
  searchable,
  searchPlaceholder = "Search...",
  onSearch,
  actions,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  // Sort data locally if no external handler
  const sortedData = sortColumn
    ? [...data].sort((a, b) => {
        const aVal = a[sortColumn as keyof T];
        const bVal = b[sortColumn as keyof T];
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : data;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table Header with Search */}
      {searchable && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100 select-none" : ""
                  } ${column.className || ""}`}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && (
                      <span className="flex flex-col">
                        <ChevronUp
                          size={12}
                          className={`-mb-1 ${
                            sortColumn === String(column.key) && sortDirection === "asc"
                              ? "text-yellow-600"
                              : "text-gray-300"
                          }`}
                        />
                        <ChevronDown
                          size={12}
                          className={`${
                            sortColumn === String(column.key) && sortDirection === "desc"
                              ? "text-yellow-600"
                              : "text-gray-300"
                          }`}
                        />
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-500">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    {emptyIcon || (
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search size={24} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500 font-medium">{emptyMessage}</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-4 py-4 text-sm text-gray-700 ${column.className || ""}`}
                    >
                      {column.render
                        ? column.render(row)
                        : String(row[column.key as keyof T] ?? "-")}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Status Badge Component
interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "paid" | "overdue" | "partial";
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = {
    active: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
    inactive: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
    paid: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
    overdue: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
    partial: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  };

  const { bg, text, dot } = config[status] || config.pending;
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {displayLabel}
    </span>
  );
}

// Action Button Component
interface ActionButtonProps {
  onClick?: () => void;
  icon: ReactNode;
  label: string;
  variant?: "default" | "danger";
}

export function ActionButton({ onClick, icon, label, variant = "default" }: ActionButtonProps) {
  const variantClasses = {
    default: "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
    danger: "text-gray-600 hover:text-red-600 hover:bg-red-50",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${variantClasses[variant]}`}
      title={label}
    >
      {icon}
    </button>
  );
}
