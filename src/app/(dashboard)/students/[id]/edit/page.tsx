// Edit Student Page
import { PageHeader } from "@/components/dashboard/page-header";
import { StudentForm } from "../../student-form";
import { getStudentById } from "@/server/queries/students";
import { getClasses } from "@/server/queries/classes";
import { getSections } from "@/server/queries/sections";
import { notFound } from "next/navigation";

interface EditStudentPageProps {
  params: Promise<{ id: string }>;
}

interface ClassData {
  id: string;
  name: string;
}

interface SectionData {
  id: string;
  name: string;
  class_id: string;
}

interface StudentData {
  id: string;
  name: string;
  registration_no: string;
  father_name: string;
  mother_name?: string;
  father_cnic?: string;
  mother_cnic?: string;
  date_of_birth: string;
  gender: string;
  cnic?: string;
  blood_group?: string;
  phone?: string;
  email?: string;
  emergency_contact?: string;
  address?: string;
  admission_date: string;
  status: string;
  class_id: string;
  section_id?: string;
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = await params;

  let student: StudentData;
  try {
    student = await getStudentById(id) as StudentData;
  } catch {
    notFound();
  }

  const [classes, allSections] = await Promise.all([
    getClasses(true),
    getSections(),
  ]) as [ClassData[], SectionData[]];

  const classOptions = classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
  }));

  // Group sections by class_id
  const sectionsByClass: Record<string, { id: string; name: string }[]> = {};
  allSections.forEach((section) => {
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
        title="Edit Student"
        description={`Update information for ${student.name}`}
        breadcrumbs={[
          { label: "Students", href: "/students" },
          { label: student.name, href: `/students/${id}` },
          { label: "Edit" },
        ]}
      />
      <StudentForm 
        student={student} 
        classes={classOptions} 
        sections={sectionsByClass} 
      />
    </div>
  );
}
