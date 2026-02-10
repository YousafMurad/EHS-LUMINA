// Add New Class Page
import { PageHeader } from "@/components/dashboard/page-header";
import { ClassForm } from "../class-form";

export default function AddClassPage() {
  return (
    <div>
      <PageHeader
        title="Add New Class"
        description="Create a new class level"
        breadcrumbs={[
          { label: "Classes", href: "/classes" },
          { label: "Add New" },
        ]}
      />
      <ClassForm />
    </div>
  );
}
