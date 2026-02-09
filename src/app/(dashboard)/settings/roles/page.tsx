import { PageHeader } from "@/components/layout";
import { RolesSettingsClient } from "./roles-settings-client";

export default function RolesSettingsPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Roles & Permissions"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Roles & Permissions" },
        ]}
      />
      <RolesSettingsClient />
    </div>
  );
}
