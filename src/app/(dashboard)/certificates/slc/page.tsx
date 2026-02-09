import { PageHeader } from "@/components/layout";
import { SLCClient } from "./slc-client";

export default function SLCPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="School Leaving Certificate"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Certificates", href: "/certificates" },
          { label: "SLC" },
        ]}
      />
      <SLCClient />
    </div>
  );
}
