// Section Actions Component
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import { deleteSection } from "@/server/actions/sections";

interface SectionActionsProps {
  section: {
    id: string;
    name: string;
    classes?: { name: string };
  };
}

export function SectionActions({ section }: SectionActionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${section.classes?.name} - ${section.name}"?`)) return;
    
    setIsLoading(true);
    const result = await deleteSection(section.id);
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
                router.push(`/sections/${section.id}`);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Eye size={16} />
              View Details
            </button>
            
            <button
              onClick={() => {
                router.push(`/sections/${section.id}/edit`);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Edit size={16} />
              Edit Section
            </button>
            
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              disabled={isLoading}
            >
              <Trash2 size={16} />
              Delete Section
            </button>
          </div>
        </>
      )}
    </div>
  );
}
