// Teachers List Page - View all teachers with filters
import { PageHeader, PageHeaderButton } from "@/components/dashboard/page-header";
import { getTeachers, getTeacherStats } from "@/server/queries/teachers";
import { Plus, Users, Briefcase, GraduationCap } from "lucide-react";
import { TeachersTable } from "./teachers-table";

interface TeachersPageProps {
  searchParams: Promise<{
    search?: string;
    contract_type?: string;
    page?: string;
  }>;
}

export default async function TeachersPage({ searchParams }: TeachersPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  const [teachersData, stats] = await Promise.all([
    getTeachers({
      search: params.search,
      contract_type: params.contract_type,
      is_active: true,
      page,
      limit: 20,
    }),
    getTeacherStats(),
  ]);

  return (
    <div>
      <PageHeader
        title="Teachers"
        description={`Manage all teacher records (${stats.total} total)`}
        breadcrumbs={[{ label: "Teachers" }]}
      >
        <PageHeaderButton href="/teachers/new" icon={<Plus size={18} />} variant="primary">
          Add Teacher
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
              <p className="text-sm text-gray-500">Total Teachers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Briefcase size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.byContractType?.permanent || 0}</p>
              <p className="text-sm text-gray-500">Permanent</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <GraduationCap size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.byContractType?.contract || 0}</p>
              <p className="text-sm text-gray-500">Contract</p>
            </div>
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <TeachersTable
        teachers={teachersData.teachers}
        total={teachersData.total}
        page={teachersData.page}
        totalPages={teachersData.totalPages}
        currentFilters={{
          search: params.search || "",
          contract_type: params.contract_type || "",
        }}
      />
    </div>
  );
}
