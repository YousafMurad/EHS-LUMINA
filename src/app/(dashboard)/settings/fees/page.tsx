// Fee Settings Page
import { PageHeader } from "@/components/dashboard/page-header";
import { FeeSettingsForm } from "./fee-settings-form";

export default function FeeSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Fee Configuration"
        description="Configure fee structures, late fees, and payment settings"
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Fee Configuration" },
        ]}
      />
      
      <FeeSettingsForm />
    </div>
  );
}
