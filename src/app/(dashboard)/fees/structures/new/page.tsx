// Add New Fee Structure Page
import { PageHeader } from "@/components/dashboard/page-header";
import { FeeStructureForm } from "../fee-structure-form";
import { getClasses } from "@/server/queries/classes";
import { getSessions } from "@/server/queries/sessions";

interface ClassData {
  id: string;
  name: string;
}

interface SessionData {
  id: string;
  name: string;
  is_active: boolean;
}

export default async function AddFeeStructurePage() {
  const [classes, sessions] = await Promise.all([
    getClasses(true),
    getSessions(),
  ]) as [ClassData[], SessionData[]];

  const classOptions = classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
  }));

  const sessionOptions = sessions.map((s) => ({
    id: s.id,
    name: s.name,
    is_active: s.is_active,
  }));

  return (
    <div>
      <PageHeader
        title="Add Fee Structure"
        description="Configure fee amounts for a class"
        breadcrumbs={[
          { label: "Fee Management", href: "/fees" },
          { label: "Fee Structures", href: "/fees/structures" },
          { label: "Add New" },
        ]}
      />
      <FeeStructureForm classes={classOptions} sessions={sessionOptions} />
    </div>
  );
}
