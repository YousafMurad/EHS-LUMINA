// Sections Table - Client component for displaying sections
"use client";

import { BookOpen, GraduationCap, User } from "lucide-react";
import { DataTablePro, StatusBadge } from "@/components/tables/data-table-pro";
import { SectionActions } from "./section-actions";

interface SectionData {
  id: string;
  name: string;
  capacity?: number;
  is_active: boolean;
  classes?: { name: string };
  teachers?: { name: string };
}

interface SectionsTableProps {
  sections: SectionData[];
}

export function SectionsTable({ sections }: SectionsTableProps) {
  const columns = [
    {
      key: "name",
      header: "Section",
      sortable: true,
      render: (section: SectionData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <BookOpen size={20} className="text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{section.name}</p>
            <p className="text-xs text-gray-500">
              Capacity: {section.capacity || "Unlimited"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "class",
      header: "Class",
      sortable: true,
      render: (section: SectionData) => (
        <div className="flex items-center gap-2">
          <GraduationCap size={16} className="text-purple-500" />
          <span>{section.classes?.name || "-"}</span>
        </div>
      ),
    },
    {
      key: "teacher",
      header: "Class Teacher",
      render: (section: SectionData) => (
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <span>{section.teachers?.name || "Not Assigned"}</span>
        </div>
      ),
    },
    {
      key: "capacity",
      header: "Capacity",
      render: (section: SectionData) => (
        <span className="text-gray-600">{section.capacity || "∞"}</span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (section: SectionData) => (
        <StatusBadge status={section.is_active ? "active" : "inactive"} />
      ),
    },
  ];

  return (
    <DataTablePro
      data={sections}
      columns={columns}
      searchable
      searchPlaceholder="Search sections..."
      actions={(section: SectionData) => <SectionActions section={section} />}
    />
  );
}
