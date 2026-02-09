// Add New Session Page
import { PageHeader } from "@/components/dashboard/page-header";
import { SessionForm } from "../session-form";

export default function AddSessionPage() {
  return (
    <div>
      <PageHeader
        title="Add New Session"
        description="Create a new academic session"
        breadcrumbs={[
          { label: "Sessions", href: "/sessions" },
          { label: "Add New" },
        ]}
      />
      <SessionForm />
    </div>
  );
}
