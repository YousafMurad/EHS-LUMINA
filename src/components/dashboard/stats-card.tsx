// Dashboard Stats Cards Component
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  color: "blue" | "green" | "yellow" | "red" | "purple";
}

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    border: "border-blue-100",
  },
  green: {
    bg: "bg-green-50",
    icon: "bg-green-100 text-green-600",
    border: "border-green-100",
  },
  yellow: {
    bg: "bg-yellow-50",
    icon: "bg-yellow-100 text-yellow-600",
    border: "border-yellow-100",
  },
  red: {
    bg: "bg-red-50",
    icon: "bg-red-100 text-red-600",
    border: "border-red-100",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-100 text-purple-600",
    border: "border-purple-100",
  },
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color,
}: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl border ${colors.border} p-6 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 flex items-center gap-1 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-500">from last month</span>
            </p>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors.icon}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  children: React.ReactNode;
}

export function StatsGrid({ children }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {children}
    </div>
  );
}
