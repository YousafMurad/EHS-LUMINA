// Edit Session Page
import { notFound } from "next/navigation";
import { getSessionById } from "@/server/queries/sessions";
import { PageHeader } from "@/components/dashboard/page-header";
import { SessionForm } from "../../session-form";

interface EditSessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSessionPage({ params }: EditSessionPageProps) {
  const { id } = await params;
  const session = await getSessionById(id);

  if (!session) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title="Edit Session"
        description={`Editing ${session.name}`}
        breadcrumbs={[
          { label: "Sessions", href: "/sessions" },
          { label: "Edit" },
        ]}
      />
      <SessionForm session={session} />
    </div>
  );
}
