// Currency and Number Formatting Utilities

// Format currency (Pakistani Rupees)
export function formatCurrency(
  amount: number,
  currency: string = "PKR",
  locale: string = "en-PK"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-PK").format(num);
}

// Parse currency string to number
export function parseCurrency(value: string): number {
  return Number(value.replace(/[^0-9.-]+/g, ""));
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${value}%`;
}

// Round to decimal places
export function roundTo(num: number, decimals: number = 2): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Generate fee breakdown
export function calculateFeeBreakdown(fees: { amount: number; label: string }[]): {
  items: { label: string; amount: number }[];
  total: number;
} {
  const total = fees.reduce((sum, fee) => sum + fee.amount, 0);
  return {
    items: fees,
    total,
  };
}
