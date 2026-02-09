// Settings Page - System configuration
import { PageHeader } from "@/components/dashboard/page-header";
import { 
  Building2, 
  DollarSign, 
  Shield, 
  FileText, 
  History, 
  ArrowRight,
  School,
  Bell,
  Database
} from "lucide-react";
import Link from "next/link";

const settingsCategories = [
  {
    title: "General Settings",
    description: "School information, logo, contact details, and branding",
    icon: Building2,
    href: "/settings/general",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Fee Configuration",
    description: "Fee structures, late fee policies, discounts, and payment settings",
    icon: DollarSign,
    href: "/settings/fees",
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Roles & Permissions",
    description: "Manage user roles and access control for operators",
    icon: Shield,
    href: "/settings/roles",
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "Academic Policies",
    description: "Promotion rules, grading system, and academic calendar",
    icon: School,
    href: "/settings/policies",
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "Audit Logs",
    description: "View system activity and track changes made by users",
    icon: History,
    href: "/settings/audit-logs",
    color: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure system settings and preferences"
        breadcrumbs={[{ label: "Settings" }]}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-500">Setting Categories</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500">User Roles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bell size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Active</p>
              <p className="text-sm text-gray-500">System Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsCategories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-yellow-400 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center`}>
                <category.icon size={24} className={category.iconColor} />
              </div>
              <ArrowRight size={20} className="text-gray-300 group-hover:text-yellow-500 transition-colors" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-900">
              {category.title}
            </h3>
            <p className="text-sm text-gray-500">{category.description}</p>
          </Link>
        ))}
      </div>

      {/* System Info */}
      <div className="mt-6 bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Version</p>
            <p className="font-medium text-gray-900">1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium text-gray-900">Feb 1, 2026</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Database</p>
            <p className="font-medium text-gray-900">Supabase</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Environment</p>
            <p className="font-medium text-green-600">Production</p>
          </div>
        </div>
      </div>
    </div>
  );
}
