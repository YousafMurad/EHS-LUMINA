// Financial Summary Reports Page
import { PageHeader } from "@/components/dashboard/page-header";
import { getFeeStats } from "@/server/queries/fees";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ExportButtons } from "../export-buttons";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function FinancialReportsPage() {
  const feeStats = await getFeeStats();

  // Mock financial data - in real app, this comes from database
  const financialData = {
    totalRevenue: feeStats.totalCollected + 250000, // Including other income
    feeCollection: feeStats.totalCollected,
    otherIncome: 250000,
    totalExpenses: 850000,
    salaries: 650000,
    utilities: 85000,
    maintenance: 65000,
    supplies: 50000,
    netProfit: (feeStats.totalCollected + 250000) - 850000,
    pendingDues: feeStats.totalPending,
  };

  const profitMargin = financialData.totalRevenue > 0 
    ? Math.round((financialData.netProfit / financialData.totalRevenue) * 100) 
    : 0;

  const monthlyTrend = [
    { month: "Jan", income: 285000, expense: 142000 },
    { month: "Feb", income: 310000, expense: 148000 },
    { month: "Mar", income: 295000, expense: 145000 },
    { month: "Apr", income: 320000, expense: 150000 },
    { month: "May", income: 305000, expense: 147000 },
    { month: "Jun", income: 325000, expense: 155000 },
  ];

  return (
    <div>
      <PageHeader
        title="Financial Reports"
        description="Complete financial overview and analysis"
        breadcrumbs={[
          { label: "Reports", href: "/reports" },
          { label: "Financial Reports" },
        ]}
      >
        <ExportButtons />
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(financialData.totalRevenue)}</p>
              <div className="flex items-center gap-1 mt-2 text-green-100">
                <ArrowUpRight size={14} />
                <span className="text-xs">+12.5% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(financialData.totalExpenses)}</p>
              <div className="flex items-center gap-1 mt-2 text-red-100">
                <ArrowDownRight size={14} />
                <span className="text-xs">-3.2% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Net Profit</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(financialData.netProfit)}</p>
              <div className="flex items-center gap-1 mt-2 text-blue-100">
                <span className="text-xs">{profitMargin}% profit margin</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <PiggyBank size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Dues</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(financialData.pendingDues)}</p>
              <div className="flex items-center gap-1 mt-2 text-yellow-100">
                <span className="text-xs">From {feeStats.totalStudents} students</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Wallet size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Income Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Fee Collection</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(financialData.feeCollection)}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(financialData.feeCollection / financialData.totalRevenue) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Other Income</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(financialData.otherIncome)}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(financialData.otherIncome / financialData.totalRevenue) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total Income</span>
              <span className="font-bold text-green-600">{formatCurrency(financialData.totalRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Salaries & Wages</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(financialData.salaries)}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${(financialData.salaries / financialData.totalExpenses) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Utilities</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(financialData.utilities)}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${(financialData.utilities / financialData.totalExpenses) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Maintenance</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(financialData.maintenance)}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${(financialData.maintenance / financialData.totalExpenses) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Supplies</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(financialData.supplies)}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${(financialData.supplies / financialData.totalExpenses) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total Expenses</span>
              <span className="font-bold text-red-600">{formatCurrency(financialData.totalExpenses)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Financial Trend</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Month</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Income</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Expenses</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Net</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {monthlyTrend.map((row) => {
                const net = row.income - row.expense;
                const margin = Math.round((net / row.income) * 100);
                return (
                  <tr key={row.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{row.month} 2026</td>
                    <td className="px-6 py-4 text-right text-green-600 font-medium">{formatCurrency(row.income)}</td>
                    <td className="px-6 py-4 text-right text-red-600 font-medium">{formatCurrency(row.expense)}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(net)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[80px]">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${margin}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{margin}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-200">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">Total</td>
                <td className="px-6 py-4 text-right font-bold text-green-600">
                  {formatCurrency(monthlyTrend.reduce((sum, row) => sum + row.income, 0))}
                </td>
                <td className="px-6 py-4 text-right font-bold text-red-600">
                  {formatCurrency(monthlyTrend.reduce((sum, row) => sum + row.expense, 0))}
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  {formatCurrency(monthlyTrend.reduce((sum, row) => sum + (row.income - row.expense), 0))}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-blue-600">
                    {Math.round((monthlyTrend.reduce((sum, row) => sum + (row.income - row.expense), 0) / 
                      monthlyTrend.reduce((sum, row) => sum + row.income, 0)) * 100)}%
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
