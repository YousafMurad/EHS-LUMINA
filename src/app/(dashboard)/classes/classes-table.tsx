// Classes Table - Client component for displaying classes
"use client";

import { GraduationCap, Users, BookOpen } from "lucide-react";
import { DataTablePro, StatusBadge } from "@/components/tables/data-table-pro";
import { ClassActions } from "./class-actions";

interface ClassData {
  id: string;
  name: string;
  description?: string;
  grade_level: number;
  section_count?: number;
  student_count?: number;
  is_active: boolean;
}

interface ClassesTableProps {
  classes: ClassData[];
}

export function ClassesTable({ classes }: ClassesTableProps) {
  const columns = [
    {
      key: "name",
      header: "Class Name",
      sortable: true,
      render: (cls: ClassData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <GraduationCap size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{cls.name}</p>
            {cls.description && (
              <p className="text-xs text-gray-500">{cls.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "grade_level",
      header: "Grade Level",
      sortable: true,
      render: (cls: ClassData) => (
        <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          Level {cls.grade_level}
        </span>
      ),
    },
    {
      key: "section_count",
      header: "Sections",
      render: (cls: ClassData) => (
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-gray-400" />
          <span>{cls.section_count || 0} sections</span>
        </div>
      ),
    },
    {
      key: "student_count",
      header: "Students",
      render: (cls: ClassData) => (
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-400" />
          <span>{cls.student_count || 0} students</span>
        </div>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (cls: ClassData) => (
        <StatusBadge 
          status={cls.is_active ? "active" : "inactive"} 
        />
      ),
    },
  ];

  return (
    <DataTablePro
      data={classes}
      columns={columns}
      searchable
      searchPlaceholder="Search classes..."
      actions={(cls: ClassData) => <ClassActions classItem={cls} />}
    />
  );
}
