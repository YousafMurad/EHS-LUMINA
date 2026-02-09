// Class Actions Component - Client side actions for classes
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, MoreVertical, BookOpen } from "lucide-react";
import { deleteClass } from "@/server/actions/classes";

interface ClassActionsProps {
  classItem: {
    id: string;
    name: string;
    student_count?: number;
  };
}

export function ClassActions({ classItem }: ClassActionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${classItem.name}"?`)) return;
    
    setIsLoading(true);
    const result = await deleteClass(classItem.id);
    if (result.error) {
      alert(result.error);
    }
    setIsLoading(false);
    setIsOpen(false);
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        disabled={isLoading}
      >
        <MoreVertical size={18} className="text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-1">
            <button
              onClick={() => {
                router.push(`/classes/${classItem.id}`);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Eye size={16} />
              View Details
            </button>
            
            <button
              onClick={() => {
                router.push(`/classes/${classItem.id}/edit`);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Edit size={16} />
              Edit Class
            </button>

            <button
              onClick={() => {
                router.push(`/sections/new?class_id=${classItem.id}`);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <BookOpen size={16} />
              Add Section
            </button>
            
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              disabled={isLoading || (classItem.student_count || 0) > 0}
            >
              <Trash2 size={16} />
              Delete Class
            </button>
          </div>
        </>
      )}
    </div>
  );
}
