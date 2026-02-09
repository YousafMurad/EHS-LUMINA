// Operator Dashboard - Front desk operations view
"use client";

import Link from "next/link";
import {
  Users,
  UserPlus,
  DollarSign,
  GraduationCap,
  Clock,
  Calendar,
  ArrowRight,
  ChevronRight,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Receipt,
  Search,
  CreditCard,
  ClipboardList,
  Award,
  Printer,
  Eye,
} from "lucide-react";

interface OperatorStats {
  totalStudents: number;
  newAdmissionsToday: number;
  newAdmissionsThisMonth: number;
  totalClasses: number;
  totalSections: number;
  pendingFees: number;
  collectedToday: number;
  collectedThisMonth: number;
  overdueCount: number;
}

interface RecentStudent {
  id: string;
  registrationNo: string;
  name: string;
  className: string;
  sectionName: string;
  admissionDate: string;
}

interface PendingFeeStudent {
  id: string;
  registrationNo: string;
  name: string;
  className: string;
  pendingAmount: number;
  dueDate: string;
  isOverdue: boolean;
}

interface OperatorDashboardProps {
  operatorName: string;
  stats: OperatorStats;
  recentAdmissions: RecentStudent[];
  pendingFees: PendingFeeStudent[];
  currentSession: string;
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtext,
  href,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtext?: string;
  href?: string;
}) {
  const colorClasses: Record<string, { bg: string; icon: string; border: string; hover: string }> = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100", hover: "hover:border-blue-300" },
    green: { bg: "bg-green-50", icon: "text-green-600", border: "border-green-100", hover: "hover:border-green-300" },
    yellow: { bg: "bg-yellow-50", icon: "text-yellow-600", border: "border-yellow-100", hover: "hover:border-yellow-300" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-100", hover: "hover:border-purple-300" },
    red: { bg: "bg-red-50", icon: "text-red-600", border: "border-red-100", hover: "hover:border-red-300" },
    indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", border: "border-indigo-100", hover: "hover:border-indigo-300" },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  const content = (
    <div className={`bg-white rounded-xl border ${colors.border} p-5 ${href ? colors.hover : ""} transition-all ${href ? "cursor-pointer hover:shadow-md" : ""}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
          <Icon size={24} className={colors.icon} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

// Quick Action Button
function QuickAction({
  href,
  icon: Icon,
  title,
  description,
  color,
  badge,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  badge?: string | number;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    green: "bg-green-50 text-green-600 group-hover:bg-green-100",
    yellow: "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
    red: "bg-red-50 text-red-600 group-hover:bg-red-100",
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100",
  };

  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-md transition-all group"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${colorClasses[color]}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">{title}</h4>
          {badge !== undefined && (
            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <ArrowRight size={20} className="text-gray-400 group-hover:text-yellow-500 transition-colors" />
    </Link>
  );
}

// Format currency
function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₨ ${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₨ ${(amount / 1000).toFixed(0)}K`;
  }
  return `₨ ${amount.toLocaleString()}`;
}

export function OperatorDashboard({
  operatorName,
  stats,
  recentAdmissions,
  pendingFees,
  currentSession,
}: OperatorDashboardProps) {
  // Get current date info
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", { 
    month: "long", 
    day: "numeric", 
    year: "numeric" 
  });
  const timeStr = today.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-sm mb-1">
              <Clock size={14} />
              <span>{dayName}, {dateStr} • {timeStr}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome, {operatorName.split(" ")[0]}! 👋
            </h1>
            <p className="text-indigo-100 mt-2">
              Front Desk Operations Dashboard • {currentSession}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/students/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors shadow-sm"
            >
              <UserPlus size={18} />
              New Admission
            </Link>
            <Link
              href="/fees/collection"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-400 transition-colors"
            >
              <CreditCard size={18} />
              Collect Fee
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="blue"
          subtext="Active enrolled"
          href="/students"
        />
        <StatCard
          title="New Today"
          value={stats.newAdmissionsToday}
          icon={UserPlus}
          color="green"
          subtext="Admissions today"
          href="/students?filter=today"
        />
        <StatCard
          title="This Month"
          value={stats.newAdmissionsThisMonth}
          icon={TrendingUp}
          color="purple"
          subtext="New admissions"
        />
        <StatCard
          title="Collected Today"
          value={formatCurrency(stats.collectedToday)}
          icon={DollarSign}
          color="green"
          subtext="Fee collection"
          href="/fees/collection"
        />
        <StatCard
          title="Pending Fees"
          value={formatCurrency(stats.pendingFees)}
          icon={Receipt}
          color="yellow"
          subtext={`${stats.overdueCount} overdue`}
          href="/fees/dues"
        />
        <StatCard
          title="Classes"
          value={stats.totalClasses}
          icon={GraduationCap}
          color="indigo"
          subtext={`${stats.totalSections} sections`}
          href="/classes"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions & Recent */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <QuickAction
                href="/students/new"
                icon={UserPlus}
                title="New Admission"
                description="Register a new student"
                color="green"
              />
              <QuickAction
                href="/fees/collection"
                icon={CreditCard}
                title="Collect Fee"
                description="Accept fee payment"
                color="blue"
              />
              <QuickAction
                href="/students"
                icon={Search}
                title="Search Student"
                description="Find student details"
                color="purple"
              />
              <QuickAction
                href="/fees/dues"
                icon={AlertTriangle}
                title="Due Fees"
                description="View pending payments"
                color="red"
                badge={stats.overdueCount > 0 ? stats.overdueCount : undefined}
              />
              <QuickAction
                href="/certificates"
                icon={Award}
                title="Certificates"
                description="Generate certificates"
                color="yellow"
              />
              <QuickAction
                href="/fees/history"
                icon={ClipboardList}
                title="Fee History"
                description="View payment records"
                color="indigo"
              />
            </div>
          </div>

          {/* Recent Admissions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Admissions</h2>
              <Link
                href="/students"
                className="text-sm text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1"
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>

            {recentAdmissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="pb-3">Reg. No</th>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Class</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentAdmissions.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="py-3">
                          <span className="text-sm font-medium text-gray-900">{student.registrationNo}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-700">{student.name}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-600">
                            {student.className} - {student.sectionName}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-500">
                            {new Date(student.admissionDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href={`/students/${student.id}`}
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            <Eye size={18} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No recent admissions</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Pending Fees & Info */}
        <div className="space-y-6">
          {/* Pending Fees */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Pending Fee Payments</h3>
              <Link
                href="/fees/dues"
                className="text-xs text-yellow-600 hover:text-yellow-700 font-medium"
              >
                View All
              </Link>
            </div>

            {pendingFees.length > 0 ? (
              <div className="space-y-3">
                {pendingFees.slice(0, 5).map((fee) => (
                  <div
                    key={fee.id}
                    className={`p-3 rounded-lg border ${
                      fee.isOverdue ? "border-red-200 bg-red-50" : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{fee.name}</span>
                      {fee.isOverdue && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                          Overdue
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{fee.registrationNo} • {fee.className}</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(fee.pendingAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        Due: {new Date(fee.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <Link
                        href={`/fees/collection?student=${fee.id}`}
                        className="text-xs text-yellow-600 hover:text-yellow-700 font-medium"
                      >
                        Collect →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={24} className="text-green-500" />
                </div>
                <p className="text-gray-500 text-sm">No pending fees!</p>
              </div>
            )}
          </div>

          {/* Today's Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Today&apos;s Summary</h3>
                <p className="text-xs text-gray-500">{dateStr}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New Admissions</span>
                <span className="font-semibold text-gray-900">{stats.newAdmissionsToday}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fee Collected</span>
                <span className="font-semibold text-green-600">{formatCurrency(stats.collectedToday)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Dues</span>
                <span className="font-semibold text-yellow-600">{stats.overdueCount} students</span>
              </div>
            </div>
          </div>

          {/* Print/Reports Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Reports & Printing</h3>
            <div className="space-y-2">
              <Link
                href="/reports/students"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText size={18} className="text-gray-400" />
                <span className="text-sm text-gray-700">Student List</span>
              </Link>
              <Link
                href="/reports/fees"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Receipt size={18} className="text-gray-400" />
                <span className="text-sm text-gray-700">Fee Report</span>
              </Link>
              <Link
                href="/certificates"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer size={18} className="text-gray-400" />
                <span className="text-sm text-gray-700">Print Certificates</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
