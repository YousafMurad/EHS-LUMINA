// General Settings Page
import { PageHeader } from "@/components/dashboard/page-header";
import { GeneralSettingsForm } from "./general-settings-form";

export default function GeneralSettingsPage() {
  return (
    <div>
      <PageHeader
        title="General Settings"
        description="Manage school information, branding, and contact details"
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "General Settings" },
        ]}
      />
      
      <GeneralSettingsForm />
    </div>
  );
}
