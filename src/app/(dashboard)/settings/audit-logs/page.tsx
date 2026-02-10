import { PageHeader } from "@/components/layout";
import { AuditLogsClient } from "./audit-logs-client";

export default function AuditLogsPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Audit Logs"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Audit Logs" },
        ]}
      />
      <AuditLogsClient />
    </div>
  );
}
