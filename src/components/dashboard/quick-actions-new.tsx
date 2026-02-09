// Quick Actions Component for Dashboard
import Link from "next/link";
import {
  UserPlus,
  DollarSign,
  GraduationCap,
  FileText,
  ArrowRight,
  LucideIcon,
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: "blue" | "green" | "yellow" | "purple";
}

const actions: QuickAction[] = [
  {
    title: "Add New Student",
    description: "Register a new student",
    href: "/students/new",
    icon: UserPlus,
    color: "blue",
  },
  {
    title: "Collect Fee",
    description: "Record fee payment",
    href: "/fees/collection",
    icon: DollarSign,
    color: "green",
  },
  {
    title: "Add Class",
    description: "Create new class",
    href: "/classes/new",
    icon: GraduationCap,
    color: "purple",
  },
  {
    title: "Generate Report",
    description: "View analytics",
    href: "/reports",
    icon: FileText,
    color: "yellow",
  },
];

const colorClasses = {
  blue: "bg-blue-500 hover:bg-blue-600",
  green: "bg-green-500 hover:bg-green-600",
  yellow: "bg-yellow-500 hover:bg-yellow-600",
  purple: "bg-purple-500 hover:bg-purple-600",
};

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl text-white transition-all hover:scale-105 ${colorClasses[action.color]}`}
            >
              <Icon size={24} />
              <span className="text-sm font-medium text-center">{action.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

interface QuickActionButtonProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function QuickActionButton({ title, description, href, icon: Icon }: QuickActionButtonProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-md transition-all"
    >
      <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl group-hover:bg-yellow-500 group-hover:text-white transition-colors">
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <ArrowRight size={20} className="text-gray-400 group-hover:text-yellow-500 transition-colors" />
    </Link>
  );
}
