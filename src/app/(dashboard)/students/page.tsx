// Students List Page - View all students with filters
import { PageHeader, PageHeaderButton } from "@/components/dashboard/page-header";
import { getStudents, getStudentStats } from "@/server/queries/students";
import { getClasses } from "@/server/queries/classes";
import { Plus, Users, UserPlus, GraduationCap } from "lucide-react";
import { StudentsTableClient } from "./students-table-client";

interface ClassData {
  id: string;
  name: string;
}

interface StudentsPageProps {
  searchParams: Promise<{
    search?: string;
    class_id?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const params = await searchParams;
  
  const page = parseInt(params.page || "1");
  const [studentsData, stats, classes] = await Promise.all([
    getStudents({
      search: params.search,
      class_id: params.class_id,
      status: params.status || "active",
      page,
      limit: 20,
    }),
    getStudentStats(),
    getClasses(true),
  ]);

  const classOptions = (classes as ClassData[]).map((cls) => ({
    id: cls.id,
    name: cls.name,
  }));

  return (
    <div>
      <PageHeader
        title="Students"
        description={`Manage all student records (${stats.total} total)`}
        breadcrumbs={[{ label: "Students" }]}
      >
        <PageHeaderButton href="/students/new" icon={<Plus size={18} />} variant="primary">
          Add Student
        </PageHeaderButton>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserPlus size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.newThisMonth}</p>
              <p className="text-sm text-gray-500">New This Month</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <GraduationCap size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.byClass).length}</p>
              <p className="text-sm text-gray-500">Active Classes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <StudentsTableClient
        students={studentsData.students}
        total={studentsData.total}
        page={studentsData.page}
        totalPages={studentsData.totalPages}
        classOptions={classOptions}
        currentFilters={{
          search: params.search || "",
          class_id: params.class_id || "",
          status: params.status || "active",
        }}
      />
    </div>
  );
}
