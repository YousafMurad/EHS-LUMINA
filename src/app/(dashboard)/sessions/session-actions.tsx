// Session Actions Component - Client side actions for sessions
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, CheckCircle, MoreVertical } from "lucide-react";
import { setActiveSession, deleteSession } from "@/server/actions/sessions";

interface SessionActionsProps {
  session: {
    id: string;
    name: string;
    is_active: boolean;
  };
}

export function SessionActions({ session }: SessionActionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetActive = async () => {
    setIsLoading(true);
    const result = await setActiveSession(session.id);
    if (result.error) {
      alert(result.error);
    }
    setIsLoading(false);
    setIsOpen(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${session.name}"?`)) return;
    
    setIsLoading(true);
    const result = await deleteSession(session.id);
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
                router.push(`/sessions/${session.id}/edit`);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Edit size={16} />
              Edit Session
            </button>
            
            {!session.is_active && (
              <button
                onClick={handleSetActive}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                disabled={isLoading}
              >
                <CheckCircle size={16} />
                Set as Active
              </button>
            )}
            
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              disabled={isLoading}
            >
              <Trash2 size={16} />
              Delete Session
            </button>
          </div>
        </>
      )}
    </div>
  );
}
