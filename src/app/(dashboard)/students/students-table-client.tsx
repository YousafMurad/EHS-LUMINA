// Students Table Client Component
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, MoreVertical } from "lucide-react";
import { deleteStudent } from "@/server/actions/students";

interface Student {
  id: string;
  name: string;
  registration_no: string;
  father_name: string;
  phone?: string;
  photo_url?: string;
  status: string;
  classes?: { id: string; name: string };
  sections?: { id: string; name: string };
}

interface ClassOption {
  id: string;
  name: string;
}

interface StudentsTableClientProps {
  students: Student[];
  total: number;
  page: number;
  totalPages: number;
  classOptions: ClassOption[];
  currentFilters: {
    search: string;
    class_id: string;
    status: string;
  };
}

export function StudentsTableClient({
  students,
  total,
  page,
  totalPages,
  classOptions,
  currentFilters,
}: StudentsTableClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentFilters.search);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const updateFilters = (updates: Partial<typeof currentFilters>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Reset to page 1 when filters change
    if (!updates.hasOwnProperty("page")) {
      params.set("page", "1");
    }
    
    router.push(`/students?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    
    setIsDeleting(id);
    const result = await deleteStudent(id);
    
    if (result.error) {
      alert(result.error);
    }
    
    setIsDeleting(null);
    setOpenDropdown(null);
    router.refresh();
  };

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/students?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, registration no, or father name..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
            />
          </div>
        </form>

        {/* Class Filter */}
        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={currentFilters.class_id}
            onChange={(e) => updateFilters({ class_id: e.target.value })}
            className="pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
          >
            <option value="">All Classes</option>
            {classOptions.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <select
          value={currentFilters.status}
          onChange={(e) => updateFilters({ status: e.target.value })}
          className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="active">Active</option>
          <option value="left">Left</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      {students.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No students found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Reg. No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Father Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Class / Section
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {student.photo_url ? (
                          <img
                            src={student.photo_url}
                            alt={student.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-2 border-blue-100">
                            <span className="text-blue-600 font-semibold text-sm">
                              {student.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {student.registration_no}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.father_name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">{student.classes?.name || "-"}</span>
                        {student.sections?.name && (
                          <span className="text-gray-400 ml-1">/ {student.sections.name}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.phone || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === student.id ? null : student.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical size={18} className="text-gray-500" />
                        </button>
                        
                        {openDropdown === student.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setOpenDropdown(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                              <button
                                onClick={() => {
                                  router.push(`/students/${student.id}`);
                                  setOpenDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Eye size={16} className="text-gray-400" />
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  router.push(`/students/${student.id}/edit`);
                                  setOpenDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Pencil size={16} className="text-gray-400" />
                                Edit
                              </button>
                              <hr className="my-1" />
                              <button
                                onClick={() => handleDelete(student.id)}
                                disabled={isDeleting === student.id}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                              >
                                <Trash2 size={16} />
                                {isDeleting === student.id ? "Deleting..." : "Delete"}
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
              Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} students
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600 px-3">
                Page {page} of {totalPages || 1}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
