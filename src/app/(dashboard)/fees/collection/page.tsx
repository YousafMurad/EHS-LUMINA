// Fee Collection Page - Record payments
import { PageHeader } from "@/components/dashboard/page-header";
import { FeeCollectionForm } from "./fee-collection-form";

export default async function FeeCollectionPage() {
  return (
    <div>
      <PageHeader
        title="Collect Fee"
        description="Record a fee payment for a student"
        breadcrumbs={[
          { label: "Fee Management", href: "/fees" },
          { label: "Collect Fee" },
        ]}
      />
      <FeeCollectionForm />
    </div>
  );
}
