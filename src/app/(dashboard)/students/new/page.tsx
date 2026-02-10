// Add New Student Page
import { PageHeader } from "@/components/dashboard/page-header";
import { StudentForm } from "../student-form";
import { getClasses } from "@/server/queries/classes";
import { getSections } from "@/server/queries/sections";

interface ClassData {
  id: string;
  name: string;
}

interface SectionData {
  id: string;
  name: string;
  class_id: string;
}

export default async function AddStudentPage() {
  const [classes, allSections] = await Promise.all([
    getClasses(true),
    getSections(),
  ]);

  const classOptions = (classes as ClassData[]).map((cls) => ({
    id: cls.id,
    name: cls.name,
  }));

  // Group sections by class_id
  const sectionsByClass: Record<string, { id: string; name: string }[]> = {};
  (allSections as SectionData[]).forEach((section) => {
    const classId = section.class_id;
    if (!sectionsByClass[classId]) {
      sectionsByClass[classId] = [];
    }
    sectionsByClass[classId].push({
      id: section.id,
      name: section.name,
    });
  });

  return (
    <div>
      <PageHeader
        title="Add New Student"
        description="Register a new student in the system"
        breadcrumbs={[
          { label: "Students", href: "/students" },
          { label: "Add New" },
        ]}
      />
      <StudentForm classes={classOptions} sections={sectionsByClass} />
    </div>
  );
}
