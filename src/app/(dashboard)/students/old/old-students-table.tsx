// Old Students Table - Client Component
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, GraduationCap, Eye, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Student {
  id: string;
  name: string;
  registration_no: string;
  father_name: string;
  phone?: string;
  graduation_date?: string;
  left_date?: string;
  status: string;
  classes?: { id: string; name: string };
  sections?: { id: string; name: string };
}

interface OldStudentsTableProps {
  students: Student[];
  total: number;
  page: number;
  totalPages: number;
  classOptions: { id: string; name: string }[];
  currentFilters: {
    search: string;
    class_id: string;
  };
}

export function OldStudentsTable({
  students,
  total,
  page,
  totalPages,
  classOptions,
  currentFilters,
}: OldStudentsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentFilters.search);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/students/old?${params.toString()}`);
  };

  const handleClassChange = (classId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (classId) {
      params.set("class_id", classId);
    } else {
      params.delete("class_id");
    }
    params.delete("page");
    router.push(`/students/old?${params.toString()}`);
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
              placeholder="Search by name, reg no, father name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Class Filter */}
          <select
            value={currentFilters.class_id}
            onChange={(e) => handleClassChange(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">All Classes</option>
            {classOptions.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
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
      {students.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No old students found</p>
          <p className="text-gray-400 text-sm mt-1">
            Students who have graduated or left will appear here
          </p>
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
                    Father Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Last Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Date
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
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.registration_no}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.father_name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.classes?.name || "-"} 
                      {student.sections?.name && ` / ${student.sections.name}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        student.status === "graduated"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {student.status === "graduated" ? "Graduated" : "Left"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.graduation_date 
                        ? format(new Date(student.graduation_date), "MMM d, yyyy")
                        : student.left_date
                        ? format(new Date(student.left_date), "MMM d, yyyy")
                        : "-"
                      }
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/students/${student.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} className="text-gray-500" />
                        </Link>
                        <Link
                          href={`/certificates?student=${student.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Generate Certificate"
                        >
                          <FileText size={16} className="text-gray-500" />
                        </Link>
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
                  href={`/students/old?page=${page - 1}${currentFilters.search ? `&search=${currentFilters.search}` : ""}${currentFilters.class_id ? `&class_id=${currentFilters.class_id}` : ""}`}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/students/old?page=${page + 1}${currentFilters.search ? `&search=${currentFilters.search}` : ""}${currentFilters.class_id ? `&class_id=${currentFilters.class_id}` : ""}`}
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
