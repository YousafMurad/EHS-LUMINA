// Reports Overview Page - Dashboard for all reports
import { PageHeader } from "@/components/dashboard/page-header";
import { 
  DollarSign, 
  Users, 
  GraduationCap, 
  TrendingUp,
  FileText,
  Download,
  Calendar,
  ArrowRight,
  BarChart3,
  PieChart,
  UserCheck
} from "lucide-react";
import Link from "next/link";

const reportCards = [
  {
    title: "Fee Reports",
    description: "Collection summaries, pending dues, payment history",
    icon: DollarSign,
    href: "/reports/fees",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    stats: [
      { label: "Collection", value: "View" },
      { label: "Dues", value: "View" },
    ],
  },
  {
    title: "Student Reports",
    description: "Enrollment statistics, class-wise distribution",
    icon: Users,
    href: "/reports/students",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    stats: [
      { label: "Enrollment", value: "View" },
      { label: "Demographics", value: "View" },
    ],
  },
  {
    title: "Class Reports",
    description: "Class performance, section-wise analysis",
    icon: GraduationCap,
    href: "/reports/classes",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    stats: [
      { label: "Strength", value: "View" },
      { label: "Analysis", value: "View" },
    ],
  },
  {
    title: "Attendance Reports",
    description: "Daily attendance, trends, and student tracking",
    icon: UserCheck,
    href: "/reports/attendance",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600",
    stats: [
      { label: "Daily", value: "View" },
      { label: "Trends", value: "View" },
    ],
  },
  {
    title: "Financial Reports",
    description: "Income, expenses, profit/loss statements",
    icon: TrendingUp,
    href: "/reports/financial",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
    stats: [
      { label: "Income", value: "View" },
      { label: "Summary", value: "View" },
    ],
  },
];

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate and export comprehensive reports"
        breadcrumbs={[{ label: "Reports" }]}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-500">Report Types</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">PDF</p>
              <p className="text-sm text-gray-500">Export Format</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Download size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Excel</p>
              <p className="text-sm text-gray-500">Data Export</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <PieChart size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Charts</p>
              <p className="text-sm text-gray-500">Visualizations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {reportCards.map((report) => (
          <Link
            key={report.title}
            href={report.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-yellow-400 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${report.bgColor} rounded-xl flex items-center justify-center`}>
                <report.icon size={24} className={report.iconColor} />
              </div>
              <ArrowRight size={20} className="text-gray-300 group-hover:text-yellow-500 transition-colors" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-900">
              {report.title}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{report.description}</p>
            
            <div className="flex items-center gap-4">
              {report.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  <span className="text-xs text-gray-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-gray-500" />
          Quick Date Ranges
        </h3>
        <div className="flex flex-wrap gap-3">
          {["Today", "This Week", "This Month", "This Quarter", "This Year", "Custom Range"].map((range) => (
            <button
              key={range}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-yellow-100 hover:text-yellow-700 transition-colors text-sm font-medium"
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
