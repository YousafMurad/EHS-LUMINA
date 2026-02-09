// Fee Overview Page - Fee management dashboard
import { PageHeader, PageHeaderButton } from "@/components/dashboard/page-header";
import { getFeeStats, getPaymentHistory } from "@/server/queries/fees";
import { CreditCard, TrendingUp, AlertCircle, Clock, Plus, FileText, Settings } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface Payment {
  id: string;
  receipt_no: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  students?: {
    name: string;
    registration_no: string;
  };
}

interface FeeStats {
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  collectionRate: number;
}

interface PaymentsData {
  payments: Payment[];
  total: number;
  totalPages: number;
}

export default async function FeesPage() {
  const [stats, recentPayments] = await Promise.all([
    getFeeStats(),
    getPaymentHistory({ limit: 10 }),
  ]) as [FeeStats, PaymentsData];

  return (
    <div>
      <PageHeader
        title="Fee Management"
        description="Overview of fee collection and management"
        breadcrumbs={[{ label: "Fee Management" }]}
      >
        <PageHeaderButton href="/fees/collection" icon={<Plus size={18} />} variant="primary">
          Collect Fee
        </PageHeaderButton>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CreditCard size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalCollected)}</p>
              <p className="text-sm text-gray-500">Collected This Month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPending)}</p>
              <p className="text-sm text-gray-500">Pending Fees</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalOverdue)}</p>
              <p className="text-sm text-gray-500">Overdue Fees</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.collectionRate}%</p>
              <p className="text-sm text-gray-500">Collection Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Link
          href="/fees/collection"
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white hover:from-green-600 hover:to-green-700 transition-all"
        >
          <CreditCard size={32} className="mb-4" />
          <h3 className="text-lg font-semibold mb-1">Collect Fee</h3>
          <p className="text-sm text-green-100">Record a new fee payment</p>
        </Link>

        <Link
          href="/fees/dues"
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white hover:from-yellow-600 hover:to-yellow-700 transition-all"
        >
          <Clock size={32} className="mb-4" />
          <h3 className="text-lg font-semibold mb-1">View Dues</h3>
          <p className="text-sm text-yellow-100">See all pending payments</p>
        </Link>

        <Link
          href="/fees/structures"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          <Settings size={32} className="mb-4" />
          <h3 className="text-lg font-semibold mb-1">Fee Structures</h3>
          <p className="text-sm text-blue-100">Manage fee configurations</p>
        </Link>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Payments</h2>
          <Link
            href="/fees/history"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {recentPayments.payments.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No payments recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Receipt #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentPayments.payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {payment.receipt_no}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{payment.students?.name || "-"}</p>
                        <p className="text-xs text-gray-500">{payment.students?.registration_no}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${
                        payment.payment_method === "cash"
                          ? "bg-green-100 text-green-700"
                          : payment.payment_method === "bank"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}>
                        {payment.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {payment.payment_date
                        ? format(new Date(payment.payment_date), "MMM d, yyyy")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
