// Promotion History Table - Client Component
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Promotion {
  id: string;
  created_at: string;
  students?: { id: string; name: string; registration_no: string };
  from_class?: { id: string; name: string };
  to_class?: { id: string; name: string };
  from_session?: { id: string; name: string };
  to_session?: { id: string; name: string };
}

interface PromotionHistoryTableProps {
  promotions: Promotion[];
  total: number;
  page: number;
  totalPages: number;
  classOptions: { id: string; name: string }[];
  sessionOptions: { id: string; name: string }[];
  currentFilters: {
    session_id: string;
    from_class_id: string;
  };
}

export function PromotionHistoryTable({
  promotions,
  total,
  page,
  totalPages,
  classOptions,
  sessionOptions,
  currentFilters,
}: PromotionHistoryTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/promotions/history?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Session Filter */}
          <select
            value={currentFilters.session_id}
            onChange={(e) => handleFilterChange("session_id", e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">All Sessions</option>
            {sessionOptions.map((session) => (
              <option key={session.id} value={session.id}>{session.name}</option>
            ))}
          </select>

          {/* From Class Filter */}
          <select
            value={currentFilters.from_class_id}
            onChange={(e) => handleFilterChange("from_class_id", e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">All Classes</option>
            {classOptions.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {promotions.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowUpDown size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No promotion records found</p>
          <p className="text-gray-400 text-sm mt-1">Promotions will appear here once students are promoted</p>
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
                    From Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    To Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {promotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {promotion.students?.name || "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {promotion.students?.registration_no}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {promotion.from_class?.name || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                        {promotion.to_class?.name || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {promotion.from_session?.name || "-"} → {promotion.to_session?.name || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        {format(new Date(promotion.created_at), "MMM d, yyyy")}
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
                  href={`/promotions/history?page=${page - 1}${currentFilters.session_id ? `&session_id=${currentFilters.session_id}` : ""}${currentFilters.from_class_id ? `&from_class_id=${currentFilters.from_class_id}` : ""}`}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/promotions/history?page=${page + 1}${currentFilters.session_id ? `&session_id=${currentFilters.session_id}` : ""}${currentFilters.from_class_id ? `&from_class_id=${currentFilters.from_class_id}` : ""}`}
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
