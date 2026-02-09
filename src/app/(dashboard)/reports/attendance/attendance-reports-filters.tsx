"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";

interface AttendanceReportsFiltersProps {
  classOptions: { id: string; name: string }[];
  currentFilters: {
    class_id: string;
    month: string;
    year: string;
    type: string;
  };
}

const months = [
  { value: "", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const years = [
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
];

const reportTypes = [
  { value: "daily", label: "Daily Report" },
  { value: "weekly", label: "Weekly Report" },
  { value: "monthly", label: "Monthly Report" },
  { value: "student", label: "Student-wise" },
];

export function AttendanceReportsFilters({ classOptions, currentFilters }: AttendanceReportsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/reports/attendance?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="w-48">
          <Select
            options={[
              { value: "", label: "All Classes" },
              ...classOptions.map((c) => ({ value: c.id, label: c.name })),
            ]}
            value={currentFilters.class_id}
            onChange={(e) => updateFilter("class_id", e.target.value)}
            label="Class"
          />
        </div>
        <div className="w-40">
          <Select
            options={months}
            value={currentFilters.month}
            onChange={(e) => updateFilter("month", e.target.value)}
            label="Month"
          />
        </div>
        <div className="w-32">
          <Select
            options={years}
            value={currentFilters.year}
            onChange={(e) => updateFilter("year", e.target.value)}
            label="Year"
          />
        </div>
        <div className="w-48">
          <Select
            options={reportTypes}
            value={currentFilters.type}
            onChange={(e) => updateFilter("type", e.target.value)}
            label="Report Type"
          />
        </div>
      </div>
    </div>
  );
}
