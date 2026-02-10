// Add New Section Page
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionForm } from "../section-form";
import { getClasses } from "@/server/queries/classes";
import { getTeachers } from "@/server/queries/teachers";

interface ClassData {
  id: string;
  name: string;
}

interface TeacherData {
  id: string;
  name: string;
}

export default async function AddSectionPage() {
  const [classes, teacherData] = await Promise.all([
    getClasses(true),
    getTeachers({ is_active: true, limit: 100 }),
  ]);

  const classOptions = (classes as ClassData[]).map((cls) => ({
    id: cls.id,
    name: cls.name,
  }));

  const teacherOptions = (teacherData.teachers as TeacherData[]).map((t) => ({
    id: t.id,
    name: t.name,
  }));

  return (
    <div>
      <PageHeader
        title="Add New Section"
        description="Create a new section for a class"
        breadcrumbs={[
          { label: "Sections", href: "/sections" },
          { label: "Add New" },
        ]}
      />
      <SectionForm classes={classOptions} teachers={teacherOptions} />
    </div>
  );
}
