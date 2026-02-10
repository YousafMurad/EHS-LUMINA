// Operators List Page - System users management
import { PageHeader, PageHeaderButton } from "@/components/dashboard/page-header";
import { getOperators } from "@/server/queries/operators";
import { Plus, Users, Shield, UserCog } from "lucide-react";
import { OperatorsTable } from "./operators-table";

interface OperatorsPageProps {
  searchParams: Promise<{
    search?: string;
    role?: string;
    page?: string;
  }>;
}

export default async function OperatorsPage({ searchParams }: OperatorsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  const operatorsData = await getOperators({
    search: params.search,
    role: params.role,
    is_active: true,
    page,
    limit: 20,
  });

  // Count by role
  const roleStats = operatorsData.operators.reduce((acc: Record<string, number>, op: { role: string }) => {
    acc[op.role] = (acc[op.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Operators"
        description={`Manage system users and access controls (${operatorsData.total} total)`}
        breadcrumbs={[{ label: "Operators" }]}
      >
        <PageHeaderButton href="/operators/new" icon={<Plus size={18} />} variant="primary">
          Add Operator
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
              <p className="text-2xl font-bold text-gray-900">{operatorsData.total}</p>
              <p className="text-sm text-gray-500">Total Operators</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{roleStats["super_admin"] || 0}</p>
              <p className="text-sm text-gray-500">Super Admins</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCog size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{roleStats["operator"] || 0}</p>
              <p className="text-sm text-gray-500">Operators</p>
            </div>
          </div>
        </div>
      </div>

      {/* Operators Table */}
      <OperatorsTable
        operators={operatorsData.operators}
        total={operatorsData.total}
        page={operatorsData.page}
        totalPages={operatorsData.totalPages}
        currentFilters={{
          search: params.search || "",
          role: params.role || "",
        }}
      />
    </div>
  );
}
