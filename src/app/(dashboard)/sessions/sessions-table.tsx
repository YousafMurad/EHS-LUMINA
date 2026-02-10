// Sessions Table - Client component for displaying sessions
"use client";

import { Calendar } from "lucide-react";
import { DataTablePro, StatusBadge } from "@/components/tables/data-table-pro";
import { SessionActions } from "./session-actions";

interface SessionData {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface SessionsTableProps {
  sessions: SessionData[];
}

export function SessionsTable({ sessions }: SessionsTableProps) {
  const columns = [
    {
      key: "name",
      header: "Session Name",
      sortable: true,
      render: (session: SessionData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{session.name}</p>
            <p className="text-xs text-gray-500">
              {new Date(session.start_date).toLocaleDateString()} - {new Date(session.end_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "start_date",
      header: "Start Date",
      sortable: true,
      render: (session: SessionData) => new Date(session.start_date).toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      }),
    },
    {
      key: "end_date",
      header: "End Date",
      sortable: true,
      render: (session: SessionData) => new Date(session.end_date).toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      }),
    },
    {
      key: "is_active",
      header: "Status",
      render: (session: SessionData) => (
        <StatusBadge 
          status={session.is_active ? "active" : "inactive"} 
          label={session.is_active ? "Active" : "Inactive"}
        />
      ),
    },
  ];

  return (
    <DataTablePro
      data={sessions}
      columns={columns}
      searchable
      searchPlaceholder="Search sessions..."
      actions={(session: SessionData) => <SessionActions session={session} />}
    />
  );
}
