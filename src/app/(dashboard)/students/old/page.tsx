// Old Students / Alumni Page - View graduated/left students
import { PageHeader } from "@/components/dashboard/page-header";
import { getStudents } from "@/server/queries/students";
import { getClasses } from "@/server/queries/classes";
import { OldStudentsTable } from "./old-students-table";

interface ClassData {
  id: string;
  name: string;
}

interface OldStudentsPageProps {
  searchParams: Promise<{
    search?: string;
    class_id?: string;
    page?: string;
  }>;
}

export default async function OldStudentsPage({ searchParams }: OldStudentsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  const [studentsData, classes] = await Promise.all([
    getStudents({
      search: params.search,
      class_id: params.class_id,
      status: "graduated", // or "left" - old students
      page,
      limit: 20,
    }),
    getClasses(true),
  ]);

  const classOptions = (classes as ClassData[]).map((cls) => ({
    id: cls.id,
    name: cls.name,
  }));

  return (
    <div>
      <PageHeader
        title="Old Students"
        description="View graduated and former student records"
        breadcrumbs={[
          { label: "Students", href: "/students" },
          { label: "Old Students" },
        ]}
      />

      {/* Students Table */}
      <OldStudentsTable
        students={studentsData.students}
        total={studentsData.total}
        page={studentsData.page}
        totalPages={studentsData.totalPages}
        classOptions={classOptions}
        currentFilters={{
          search: params.search || "",
          class_id: params.class_id || "",
        }}
      />
    </div>
  );
}
