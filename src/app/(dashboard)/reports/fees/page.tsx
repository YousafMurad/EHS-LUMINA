// Fee Reports Page - Collection and dues reports
import { PageHeader } from "@/components/dashboard/page-header";
import { getFeeStats } from "@/server/queries/fees";
import { getClasses } from "@/server/queries/classes";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { FeeReportsFilters } from "./fee-reports-filters";
import { ExportButtons } from "../export-buttons";

interface FeeReportsPageProps {
  searchParams: Promise<{
    class_id?: string;
    month?: string;
    year?: string;
    type?: string;
  }>;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function FeeReportsPage({ searchParams }: FeeReportsPageProps) {
  const params = await searchParams;
  
  const [stats, classes] = await Promise.all([
    getFeeStats(),
    getClasses(true),
  ]);

  type ClassType = { id: string; name: string };
  const classOptions = (classes as ClassType[]).map((cls) => ({
    id: cls.id,
    name: cls.name,
  }));

  // Mock data for reports - in real app, this would come from queries
  const collectionData = {
    totalCollected: stats.totalCollected,
    totalPending: stats.totalPending,
    totalStudents: 850, // This would come from a student count query
    collectionRate: stats.collectionRate,
  };

  const monthlyData = [
    { month: "Jan", collected: 125000, pending: 25000 },
    { month: "Feb", collected: 140000, pending: 20000 },
    { month: "Mar", collected: 135000, pending: 30000 },
    { month: "Apr", collected: 150000, pending: 15000 },
    { month: "May", collected: 145000, pending: 22000 },
    { month: "Jun", collected: 155000, pending: 18000 },
  ];

  return (
    <div>
      <PageHeader
        title="Fee Reports"
        description="Analyze fee collection and pending dues"
        breadcrumbs={[
          { label: "Reports", href: "/reports" },
          { label: "Fee Reports" },
        ]}
      >
        <ExportButtons />
      </PageHeader>

      {/* Filters */}
      <FeeReportsFilters
        classOptions={classOptions}
        currentFilters={{
          class_id: params.class_id || "",
          month: params.month || "",
          year: params.year || new Date().getFullYear().toString(),
          type: params.type || "all",
        }}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(collectionData.totalCollected)}</p>
              <p className="text-sm text-gray-500">Total Collected</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(collectionData.totalPending)}</p>
              <p className="text-sm text-gray-500">Pending Dues</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{collectionData.totalStudents}</p>
              <p className="text-sm text-gray-500">Fee Paying Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{collectionData.collectionRate}%</p>
              <p className="text-sm text-gray-500">Collection Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Collection Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Month</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Collected</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pending</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {monthlyData.map((row) => {
                const total = row.collected + row.pending;
                const rate = Math.round((row.collected / total) * 100);
                return (
                  <tr key={row.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{row.month} 2026</td>
                    <td className="px-6 py-4 text-green-600 font-medium">{formatCurrency(row.collected)}</td>
                    <td className="px-6 py-4 text-red-600 font-medium">{formatCurrency(row.pending)}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{formatCurrency(total)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[100px]">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${rate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
