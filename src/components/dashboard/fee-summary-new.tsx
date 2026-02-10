// Fee Summary Component for Dashboard
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface FeeSummaryProps {
  totalCollected?: number;
  totalPending?: number;
  thisMonth?: number;
  overdueCount?: number;
}

export function FeeSummary({
  totalCollected = 1250000,
  totalPending = 350000,
  thisMonth = 125000,
  overdueCount = 45,
}: FeeSummaryProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₨${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₨${(amount / 1000).toFixed(0)}K`;
    }
    return `₨${amount.toLocaleString()}`;
  };

  const collectionRate = ((totalCollected / (totalCollected + totalPending)) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Fee Summary</h3>
        <Link
          href="/fees"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details <ArrowRight size={16} />
        </Link>
      </div>

      {/* Collection Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Collection Rate</span>
          <span className="text-sm font-semibold text-green-600">{collectionRate}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
            style={{ width: `${collectionRate}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-green-600" />
            <span className="text-xs font-medium text-green-600">Collected</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalCollected)}</p>
        </div>

        <div className="p-4 bg-red-50 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={16} className="text-red-600" />
            <span className="text-xs font-medium text-red-600">Pending</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPending)}</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-blue-600" />
            <span className="text-xs font-medium text-blue-600">This Month</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(thisMonth)}</p>
        </div>

        <div className="p-4 bg-yellow-50 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-yellow-600" />
            <span className="text-xs font-medium text-yellow-600">Overdue</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{overdueCount} students</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href="/fees/collection"
          className="block w-full py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-center font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
        >
          Collect Fee
        </Link>
      </div>
    </div>
  );
}
