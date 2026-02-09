// Add New Operator Page
import { PageHeader } from "@/components/dashboard/page-header";
import { OperatorForm } from "./operator-form";

export default function AddOperatorPage() {
  return (
    <div>
      <PageHeader
        title="Add New Operator"
        description="Create a new system operator with login credentials and role"
        breadcrumbs={[
          { label: "Operators", href: "/operators" },
          { label: "Add New" },
        ]}
      />
      
      <OperatorForm />
    </div>
  );
}
