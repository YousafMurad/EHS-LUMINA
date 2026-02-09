// Fee Dues Page - Pending payments list
import { PageHeader, PageHeaderButton } from "@/components/dashboard/page-header";
import { getFeesDue } from "@/server/queries/fees";
import { getClasses } from "@/server/queries/classes";
import { CreditCard, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { FeesDuesFilters } from "./fees-dues-filters";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface ClassData {
  id: string;
  name: string;
}

interface FeeDue {
  id: string;
  amount: number;
  fee_month: string;
  fee_year: number;
  due_date: string;
  students?: {
    id: string;
    name: string;
    registration_no: string;
    classes?: { name: string };
    sections?: { name: string };
  };
}

interface FeeDuesPageProps {
  searchParams: Promise<{
    class_id?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function FeeDuesPage({ searchParams }: FeeDuesPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const status = (params.status || "pending") as "pending" | "overdue";

  const [feesData, classes] = await Promise.all([
    getFeesDue({
      class_id: params.class_id,
      status,
      page,
      limit: 20,
    }),
    getClasses(true),
  ]) as [{ fees: FeeDue[]; total: number; totalPages: number }, ClassData[]];

  const classOptions = classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
  }));

  return (
    <div>
      <PageHeader
        title="Fee Dues"
        description="View all pending and overdue payments"
        breadcrumbs={[
          { label: "Fee Management", href: "/fees" },
          { label: "Fee Dues" },
        ]}
      >
        <PageHeaderButton href="/fees/collection" icon={<CreditCard size={18} />} variant="primary">
          Collect Fee
        </PageHeaderButton>
      </PageHeader>

      {/* Filters - Client Component */}
      <FeesDuesFilters
        classOptions={classOptions}
        currentStatus={status}
        currentClassId={params.class_id || ""}
      />

      {/* Dues Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {feesData.fees.length === 0 ? (
          <div className="p-12 text-center">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No {status} fees found</p>
            <p className="text-gray-400 text-sm mt-1">All fees are up to date!</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {feesData.fees.map((fee) => {
                    const isOverdue = new Date(fee.due_date) < new Date();
                    return (
                      <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {fee.students?.name || "-"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {fee.students?.registration_no}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {fee.students?.classes?.name || "-"} / {fee.students?.sections?.name || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {fee.fee_month}/{fee.fee_year}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(fee.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-sm ${
                            isOverdue ? "text-red-600" : "text-gray-600"
                          }`}>
                            {isOverdue && <AlertCircle size={14} />}
                            {fee.due_date ? format(new Date(fee.due_date), "MMM d, yyyy") : "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/fees/collection?student=${fee.students?.id}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CreditCard size={14} />
                            Collect
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, feesData.total)} of {feesData.total}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/fees/dues?page=${page - 1}&status=${status}${params.class_id ? `&class_id=${params.class_id}` : ""}`}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}
                {page < feesData.totalPages && (
                  <Link
                    href={`/fees/dues?page=${page + 1}&status=${status}${params.class_id ? `&class_id=${params.class_id}` : ""}`}
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
