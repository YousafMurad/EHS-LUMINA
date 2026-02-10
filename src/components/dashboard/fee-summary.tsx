// Fee Summary Widget
interface FeeSummaryProps {
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  currency?: string;
}

export function FeeSummary({
  totalCollected,
  totalPending,
  totalOverdue,
  currency = "PKR",
}: FeeSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Collected</span>
          <span className="font-semibold text-green-600">{formatCurrency(totalCollected)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Pending</span>
          <span className="font-semibold text-yellow-600">{formatCurrency(totalPending)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Overdue</span>
          <span className="font-semibold text-red-600">{formatCurrency(totalOverdue)}</span>
        </div>
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Expected</span>
            <span className="font-bold text-gray-900">
              {formatCurrency(totalCollected + totalPending + totalOverdue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
