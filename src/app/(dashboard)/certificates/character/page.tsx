import { PageHeader } from "@/components/layout";
import { CharacterCertificateClient } from "./character-certificate-client";

export default function CharacterCertificatePage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Character Certificate"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Certificates", href: "/certificates" },
          { label: "Character Certificate" },
        ]}
      />
      <CharacterCertificateClient />
    </div>
  );
}
