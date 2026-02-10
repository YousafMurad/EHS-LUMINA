import { PageHeader } from "@/components/layout";
import { PoliciesSettingsForm } from "./policies-settings-form";

export default function PoliciesSettingsPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="System Policies"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Policies" },
        ]}
      />
      <PoliciesSettingsForm />
    </div>
  );
}
