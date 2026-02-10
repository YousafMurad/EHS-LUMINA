// Edit Section Page
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionForm } from "../../section-form";
import { getSectionById } from "@/server/queries/sections";
import { getClasses } from "@/server/queries/classes";
import { getTeachers } from "@/server/queries/teachers";
import { notFound } from "next/navigation";

interface EditSectionPageProps {
  params: Promise<{ id: string }>;
}

interface SectionData {
  id: string;
  name: string;
  class_id: string;
  capacity?: number;
  teacher_id?: string;
  is_active: boolean;
}

interface ClassData {
  id: string;
  name: string;
}

interface TeacherData {
  id: string;
  name: string;
}

export default async function EditSectionPage({ params }: EditSectionPageProps) {
  const { id } = await params;

  let section: SectionData;
  try {
    section = await getSectionById(id) as SectionData;
  } catch {
    notFound();
  }

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
        title="Edit Section"
        description={`Update section ${section.name}`}
        breadcrumbs={[
          { label: "Sections", href: "/sections" },
          { label: section.name, href: `/sections/${id}` },
          { label: "Edit" },
        ]}
      />
      <SectionForm 
        section={section} 
        classes={classOptions} 
        teachers={teacherOptions} 
      />
    </div>
  );
}
