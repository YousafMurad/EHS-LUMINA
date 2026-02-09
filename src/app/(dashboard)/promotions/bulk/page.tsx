// Bulk Promotion Page - Promote entire classes at once
import { PageHeader } from "@/components/dashboard/page-header";
import { getClasses } from "@/server/queries/classes";
import { getSessions } from "@/server/queries/sessions";
import { BulkPromotionForm } from "./bulk-promotion-form";

interface ClassType {
  id: string;
  name: string;
  grade_level?: number;
  next_class_id?: string;
  _count?: { students: number };
}

export default async function BulkPromotionPage() {
  const [classes, sessions] = await Promise.all([
    getClasses(true),
    getSessions(),
  ]);

  const classOptions = (classes as ClassType[]).map((cls) => ({
    id: cls.id,
    name: cls.name,
    nextClassId: cls.next_class_id,
  }));

  const sessionOptions = sessions.map((s: { id: string; name: string; is_active: boolean }) => ({
    id: s.id,
    name: s.name,
    isActive: s.is_active,
  }));

  return (
    <div>
      <PageHeader
        title="Bulk Promotion"
        description="Promote all students from one class to the next"
        breadcrumbs={[
          { label: "Promotions", href: "/promotions" },
          { label: "Bulk Promotion" },
        ]}
      />

      <BulkPromotionForm
        classOptions={classOptions}
        sessionOptions={sessionOptions}
      />
    </div>
  );
}
