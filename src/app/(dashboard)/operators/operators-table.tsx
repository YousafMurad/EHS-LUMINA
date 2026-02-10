// Operators Table - Client Component
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, MoreVertical, Eye, Edit, Trash2, Shield, Key } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Operator {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

interface OperatorsTableProps {
  operators: Operator[];
  total: number;
  page: number;
  totalPages: number;
  currentFilters: {
    search: string;
    role: string;
  };
}

const roleLabels: Record<string, { label: string; color: string }> = {
  super_admin: { label: "Super Admin", color: "bg-red-100 text-red-700" },
  admin: { label: "Admin", color: "bg-blue-100 text-blue-700" },
  operator: { label: "Operator", color: "bg-green-100 text-green-700" },
  accountant: { label: "Accountant", color: "bg-yellow-100 text-yellow-700" },
  teacher: { label: "Teacher", color: "bg-purple-100 text-purple-700" },
};

export function OperatorsTable({
  operators,
  total,
  page,
  totalPages,
  currentFilters,
}: OperatorsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentFilters.search);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/operators?${params.toString()}`);
  };

  const handleRoleChange = (role: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (role) {
      params.set("role", role);
    } else {
      params.delete("role");
    }
    params.delete("page");
    router.push(`/operators?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px] max-w-md relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search operators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Role Filter */}
          <select
            value={currentFilters.role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="accountant">Accountant</option>
            <option value="teacher">Teacher</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      {operators.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No operators found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Operator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {operators.map((operator) => {
                  const roleInfo = roleLabels[operator.role] || { label: operator.role, color: "bg-gray-100 text-gray-700" };
                  return (
                    <tr key={operator.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {operator.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{operator.name || "-"}</p>
                            <p className="text-xs text-gray-500">{operator.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${roleInfo.color}`}>
                          <Shield size={12} />
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {operator.phone || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          operator.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {operator.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {operator.last_login
                          ? format(new Date(operator.last_login), "MMM d, yyyy h:mm a")
                          : "Never"
                        }
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === operator.id ? null : operator.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical size={16} className="text-gray-500" />
                          </button>
                          {openDropdown === operator.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenDropdown(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                                <Link
                                  href={`/operators/${operator.id}`}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Eye size={14} /> View Details
                                </Link>
                                <Link
                                  href={`/operators/${operator.id}/edit`}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Edit size={14} /> Edit
                                </Link>
                                <Link
                                  href={`/operators/${operator.id}/permissions`}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Key size={14} /> Manage Permissions
                                </Link>
                                <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                                  <Trash2 size={14} /> Deactivate
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/operators?page=${page - 1}${currentFilters.search ? `&search=${currentFilters.search}` : ""}${currentFilters.role ? `&role=${currentFilters.role}` : ""}`}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/operators?page=${page + 1}${currentFilters.search ? `&search=${currentFilters.search}` : ""}${currentFilters.role ? `&role=${currentFilters.role}` : ""}`}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
