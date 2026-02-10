// Edit Class Page
import { notFound } from "next/navigation";
import { getClassById } from "@/server/queries/classes";
import { PageHeader } from "@/components/dashboard/page-header";
import { ClassForm } from "../../class-form";

interface EditClassPageProps {
  params: Promise<{ id: string }>;
}

interface ClassData {
  id: string;
  name: string;
  description?: string;
  grade_level: number;
  is_active: boolean;
}

export default async function EditClassPage({ params }: EditClassPageProps) {
  const { id } = await params;
  
  let classItem: ClassData;
  try {
    classItem = await getClassById(id) as ClassData;
  } catch {
    notFound();
  }

  if (!classItem) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title="Edit Class"
        description={`Editing ${classItem.name}`}
        breadcrumbs={[
          { label: "Classes", href: "/classes" },
          { label: "Edit" },
        ]}
      />
      <ClassForm classItem={classItem} />
    </div>
  );
}
