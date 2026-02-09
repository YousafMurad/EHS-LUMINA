// Teachers Table - Client Component
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, Phone, Mail, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface Teacher {
  id: string;
  name: string;
  employee_code: string;
  phone: string;
  email?: string;
  contract_type: string;
  qualification?: string;
  salary?: number;
  sections?: {
    id: string;
    name: string;
    classes?: { name: string };
  };
}

interface TeachersTableProps {
  teachers: Teacher[];
  total: number;
  page: number;
  totalPages: number;
  currentFilters: {
    search: string;
    contract_type: string;
  };
}

export function TeachersTable({
  teachers,
  total,
  page,
  totalPages,
  currentFilters,
}: TeachersTableProps) {
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
    router.push(`/teachers?${params.toString()}`);
  };

  const handleContractTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type) {
      params.set("contract_type", type);
    } else {
      params.delete("contract_type");
    }
    params.delete("page");
    router.push(`/teachers?${params.toString()}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);
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
              placeholder="Search teachers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Contract Type Filter */}
          <select
            value={currentFilters.contract_type}
            onChange={(e) => handleContractTypeChange(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">All Types</option>
            <option value="permanent">Permanent</option>
            <option value="contract">Contract</option>
            <option value="visiting">Visiting</option>
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
      {teachers.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No teachers found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Assigned Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{teacher.name}</p>
                          <p className="text-xs text-gray-500">{teacher.employee_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          {teacher.phone || "-"}
                        </div>
                        {teacher.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-400" />
                            {teacher.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        teacher.contract_type === "permanent"
                          ? "bg-green-100 text-green-700"
                          : teacher.contract_type === "contract"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {teacher.contract_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {teacher.sections ? (
                        <span>
                          {teacher.sections.classes?.name} - {teacher.sections.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {teacher.salary ? formatCurrency(teacher.salary) : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === teacher.id ? null : teacher.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical size={16} className="text-gray-500" />
                        </button>
                        {openDropdown === teacher.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenDropdown(null)}
                            />
                            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                              <Link
                                href={`/teachers/${teacher.id}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye size={14} /> View
                              </Link>
                              <Link
                                href={`/teachers/${teacher.id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Edit size={14} /> Edit
                              </Link>
                              <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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
                  href={`/teachers?page=${page - 1}${currentFilters.search ? `&search=${currentFilters.search}` : ""}${currentFilters.contract_type ? `&contract_type=${currentFilters.contract_type}` : ""}`}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/teachers?page=${page + 1}${currentFilters.search ? `&search=${currentFilters.search}` : ""}${currentFilters.contract_type ? `&contract_type=${currentFilters.contract_type}` : ""}`}
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
