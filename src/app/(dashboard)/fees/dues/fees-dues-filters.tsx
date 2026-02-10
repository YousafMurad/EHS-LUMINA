// Fee Dues Filters - Client Component
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Clock, AlertCircle } from "lucide-react";

interface FeesDuesFiltersProps {
  classOptions: { id: string; name: string }[];
  currentStatus: string;
  currentClassId: string;
}

export function FeesDuesFilters({ classOptions, currentStatus, currentClassId }: FeesDuesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    params.delete("page");
    router.push(`/fees/dues?${params.toString()}`);
  };

  const handleClassChange = (classId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (classId) {
      params.set("class_id", classId);
    } else {
      params.delete("class_id");
    }
    params.delete("page");
    router.push(`/fees/dues?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 p-4">
      <div className="flex flex-wrap gap-4">
        {/* Status Tabs */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {[
            { value: "pending", label: "Pending", icon: Clock },
            { value: "overdue", label: "Overdue", icon: AlertCircle },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStatusChange(tab.value)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                currentStatus === tab.value
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Class Filter */}
        <select
          value={currentClassId}
          onChange={(e) => handleClassChange(e.target.value)}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">All Classes</option>
          {classOptions.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
