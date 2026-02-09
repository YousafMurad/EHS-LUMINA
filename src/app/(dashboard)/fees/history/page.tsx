// Payment History Page
import { PageHeader } from "@/components/dashboard/page-header";
import { getPaymentHistory } from "@/server/queries/fees";
import { FileText, Download, Calendar } from "lucide-react";
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
  fee_month: string;
  fee_year: number;
  payment_date: string;
  students?: {
    name: string;
    registration_no: string;
  };
}

interface PaymentsData {
  payments: Payment[];
  total: number;
  totalPages: number;
}

interface PaymentHistoryPageProps {
  searchParams: Promise<{
    from_date?: string;
    to_date?: string;
    page?: string;
  }>;
}

export default async function PaymentHistoryPage({ searchParams }: PaymentHistoryPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  const paymentsData = await getPaymentHistory({
    from_date: params.from_date,
    to_date: params.to_date,
    page,
    limit: 20,
  }) as PaymentsData;

  // Calculate totals
  const totalAmount = paymentsData.payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div>
      <PageHeader
        title="Payment History"
        description="View all recorded fee payments"
        breadcrumbs={[
          { label: "Fee Management", href: "/fees" },
          { label: "Payment History" },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{paymentsData.total}</p>
              <p className="text-sm text-gray-500">Total Payments</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              <p className="text-sm text-gray-500">This Page Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {paymentsData.payments.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No payment records found</p>
          </div>
        ) : (
          <>
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
                      Fee For
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paymentsData.payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {payment.receipt_no}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.students?.name || "-"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {payment.students?.registration_no}
                          </p>
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
                        {payment.fee_month}/{payment.fee_year}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {payment.payment_date
                          ? format(new Date(payment.payment_date), "MMM d, yyyy")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/fees/memo?receipt=${payment.receipt_no}`}
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <Download size={14} />
                          Receipt
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {page} of {paymentsData.totalPages || 1}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/fees/history?page=${page - 1}${params.from_date ? `&from_date=${params.from_date}` : ""}${params.to_date ? `&to_date=${params.to_date}` : ""}`}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}
                {page < paymentsData.totalPages && (
                  <Link
                    href={`/fees/history?page=${page + 1}${params.from_date ? `&from_date=${params.from_date}` : ""}${params.to_date ? `&to_date=${params.to_date}` : ""}`}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
