"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";

interface StudentReportsFiltersProps {
  classOptions: { id: string; name: string }[];
  currentFilters: {
    class_id: string;
    gender: string;
    status: string;
  };
}

const genderOptions = [
  { value: "", label: "All Genders" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const statusOptions = [
  { value: "active", label: "Active Students" },
  { value: "inactive", label: "Inactive Students" },
  { value: "all", label: "All Students" },
];

export function StudentReportsFilters({ classOptions, currentFilters }: StudentReportsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/reports/students?${params.toString()}`);
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
            options={genderOptions}
            value={currentFilters.gender}
            onChange={(e) => updateFilter("gender", e.target.value)}
            label="Gender"
          />
        </div>
        <div className="w-48">
          <Select
            options={statusOptions}
            value={currentFilters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            label="Status"
          />
        </div>
      </div>
    </div>
  );
}
