import { PageHeader } from "@/components/layout";
import { ResultCardClient } from "./result-card-client";

export default function ResultCardPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Result Card / Sanad"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Certificates", href: "/certificates" },
          { label: "Result Card" },
        ]}
      />
      <ResultCardClient />
    </div>
  );
}
