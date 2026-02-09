// Sessions Page - Academic sessions management
import { Plus, Calendar } from "lucide-react";
import { getSessions } from "@/server/queries/sessions";
import { PageHeader, PageHeaderButton } from "@/components/dashboard/page-header";
import { SessionsTable } from "./sessions-table";

interface Session {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export default async function SessionsPage() {
  const sessions = await getSessions() as Session[];

  return (
    <div>
      <PageHeader
        title="Academic Sessions"
        description="Manage academic years and sessions"
        breadcrumbs={[{ label: "Sessions" }]}
      >
        <PageHeaderButton href="/sessions/new" icon={<Plus size={18} />}>
          Add Session
        </PageHeaderButton>
      </PageHeader>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Sessions Found</h3>
          <p className="text-gray-500 mb-6">Create your first academic session to get started</p>
          <PageHeaderButton href="/sessions/new" icon={<Plus size={18} />}>
            Create Session
          </PageHeaderButton>
        </div>
      ) : (
        <SessionsTable sessions={sessions} />
      )}
    </div>
  );
}
